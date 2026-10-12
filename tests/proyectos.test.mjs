import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const loadDependency = createRequire(import.meta.url);

function loadModule(file, imports = {}, globals = {}) {
  const loaded = { exports: {} };
  const source = fs.readFileSync(fileURLToPath(new URL(`../${file}`, import.meta.url)), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  vm.runInNewContext(compiled, {
    module: loaded,
    exports: loaded.exports,
    require: (name) => imports[name] ?? loadDependency(name),
    Error,
    Date,
    AbortSignal,
    File,
    FormData,
    Uint8Array,
    URL,
    process: { env: { API_URL: "http://api.test/" } },
    console: { error() {} },
    ...globals,
  }, { filename: file });
  return loaded.exports;
}

const validation = loadModule("src/lib/validations/proyecto.ts");
const projectId = "550e8400-e29b-41d4-a716-446655440000";
const otherProjectId = "550e8400-e29b-41d4-a716-446655440001";
const project = {
  id: projectId,
  nombre: "Huertas comunitarias",
  descripcion: "Cultivamos juntos.",
  foto_url: null,
  foto_cabeza_url: "https://images.test/header.png",
  estado: "ACTIVO",
  fecha_creacion: "2026-10-12T09:00:00",
};

function loadData(fetch, session = { name: "Fundacion", role: 2 }, token = "test-token") {
  return loadModule("src/lib/data/proyectos.ts", {
    "@/lib/auth/session": {
      getSession: async () => session,
      getAccessToken: async () => token,
    },
    "@/lib/constants/roles": { ROLES: { FUNDACION: 2, VOLUNTARIO: 1 } },
    "@/lib/validations/proyecto": validation,
  }, { fetch });
}

test("creation validates the exact contract and normalizes optional fields", () => {
  const result = validation.crearProyectoSchema.parse({
    nombre: "  Huertas  ",
    descripcion: "",
    fecha_creacion: "2020-02-29",
    foto: null,
    foto_cabeza: null,
  });
  assert.equal(JSON.stringify(result), JSON.stringify({
    nombre: "Huertas", descripcion: null, fecha_creacion: "2020-02-29T00:00:00.000Z", foto: null, foto_cabeza: null,
  }));
  for (const nombre of ["", "  ", "a".repeat(151)]) {
    assert.equal(validation.crearProyectoSchema.safeParse({ nombre, descripcion: "", fecha_creacion: "2020-01-01", foto: null, foto_cabeza: null }).success, false);
  }
  assert.equal(validation.crearProyectoSchema.safeParse({
    nombre: "a".repeat(150), descripcion: "", fecha_creacion: "2020-01-01", foto: null, foto_cabeza: null,
  }).success, true);
  for (const fecha_creacion of ["", "2021-02-29", "2020-13-01", "2099-01-01", "2020-01-01T00:00:00Z"]) {
    assert.equal(validation.crearProyectoSchema.safeParse({ nombre: "Huertas", descripcion: "", fecha_creacion, foto: null, foto_cabeza: null }).success, false);
  }
});

const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
const png = () => new File([pngBytes], "photo.png", { type: "image/png" });

test("image validation rejects non-images, empty files, spoofed types and oversize files", async () => {
  assert.equal(await validation.validateProyectoImageContent(png()), null);
  for (const file of [
    new File(["text"], "text.txt", { type: "text/plain" }),
    new File([], "empty.png", { type: "image/png" }),
    new File(["not a real png"], "fake.png", { type: "image/png" }),
    new File([new Uint8Array(2 * 1024 * 1024 + 1)], "big.png", { type: "image/png" }),
  ]) {
    assert.ok(await validation.validateProyectoImageContent(file));
  }
  const exactLimit = new Uint8Array(2 * 1024 * 1024);
  exactLimit.set(pngBytes);
  assert.equal(await validation.validateProyectoImageContent(new File([exactLimit], "max.png", { type: "image/png" })), null);
});

test("all supported image signatures are accepted", async () => {
  for (const [type, contents] of [
    ["image/jpeg", new Uint8Array([255, 216, 255, 224])],
    ["image/gif", "GIF89a"],
    ["image/webp", "RIFF0000WEBP"],
    ["image/avif", "0000ftypavif0000"],
  ]) {
    assert.equal(await validation.validateProyectoImageContent(new File([contents], "image", { type })), null);
  }
});

test("multipart request leaves Content-Type unset so fetch creates the boundary", async () => {
  const body = new FormData();
  body.set("foto", png());
  const data = loadData(async (_url, options) => {
    assert.equal(options.body, body);
    assert.equal(options.headers["Content-Type"], undefined);
    return Response.json({});
  });
  await data.requestProyectos("/fundaciones/proyectos/crear", { method: "POST", body });
});

test("list uses GET, Bearer authentication, no-store and the exact API path", async () => {
  const data = loadData(async (url, options) => {
    assert.equal(url, "http://api.test/fundaciones/proyectos");
    assert.equal(options.method, "GET");
    assert.equal(options.headers.Authorization, "Bearer test-token");
    assert.equal(options.cache, "no-store");
    assert.equal(options.body, undefined);
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json([project]);
  });
  assert.equal((await data.getProyectosFundacion())[0].id, projectId);
});

test("detail uses POST without a body and returns the project", async () => {
  const data = loadData(async (url, options) => {
    assert.equal(url, `http://api.test/fundaciones/proyectos/${projectId}`);
    assert.equal(options.method, "POST");
    assert.equal(options.body, undefined);
    return Response.json(project);
  });
  assert.equal((await data.getProyectoFundacion(projectId)).nombre, project.nombre);
});

test("detail preserves both storage URLs including their signed query parameters", async () => {
  const images = {
    foto_url: "https://storage.test/projects/photo.png?X-Amz-Signature=a%2Fb&X-Amz-Expires=900",
    foto_cabeza_url: "https://storage.test/projects/cover.webp?X-Amz-Signature=c%2Bd&X-Amz-Expires=900",
  };
  const data = loadData(async () => Response.json({ ...project, ...images }));
  const result = await data.getProyectoFundacion(projectId);
  assert.equal(result.foto_url, images.foto_url);
  assert.equal(result.foto_cabeza_url, images.foto_cabeza_url);
});

const ProjectPhoto = loadModule("src/components/proyectos/ProjectPhoto.tsx").default;

test("project avatar and cover use storage URLs directly without the Next image proxy", () => {
  for (const [variant, file, label] of [
    ["avatar", "photo.png", "Foto"],
    ["cover", "cover.webp", "Portada"],
  ]) {
    const url = `https://storage.test/${file}?X-Amz-Signature=a%2Fb&X-Amz-Expires=900`;
    const html = renderToStaticMarkup(createElement(ProjectPhoto, {
      url, name: project.nombre, variant,
    }));
    assert.ok(html.includes(`src="${url.replaceAll("&", "&amp;")}"`));
    assert.ok(html.includes(`alt="${label} de ${project.nombre}"`));
    assert.equal(html.includes("/_next/image"), false);
    assert.equal(html.includes("srcSet="), false);
    assert.ok(html.includes(variant === "avatar" ? "rounded-full border-4" : "h-32 w-full"));
  }
});

test("missing photos keep the project placeholder and invalid protocols are not loaded", () => {
  for (const url of [null, "", "projects/raw-storage-key", "javascript:alert(1)"]) {
    const html = renderToStaticMarkup(createElement(ProjectPhoto, {
      url, name: project.nombre, variant: "cover",
    }));
    assert.equal(html.includes("<img"), false);
    assert.ok(html.includes("Proyecto sin foto"));
  }
});

test("each list card shows its main image, otherwise its cover or initials", async () => {
  const projects = [
    { ...project, foto_url: "https://storage.test/main.png?signature=a%2Fb" },
    { ...project, id: otherProjectId, foto_url: null },
    { ...project, id: "550e8400-e29b-41d4-a716-446655440002", foto_url: null, foto_cabeza_url: null },
  ];
  const Page = loadModule("src/app/(dashboard)/proyectos/page.tsx", {
    "@/components/proyectos/ProjectPhoto": { default: ProjectPhoto },
    "@/lib/data/proyectos": { getProyectosFundacion: async () => projects },
  }).default;
  const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));
  assert.ok(html.includes('src="https://storage.test/main.png?signature=a%2Fb"'));
  assert.ok(html.includes(`src="${project.foto_cabeza_url}"`));
  assert.equal((html.match(/<img /g) ?? []).length, 2);
  assert.equal((html.match(/Proyecto sin foto/g) ?? []).length, 1);
  for (const item of projects) {
    assert.ok(html.includes(`href="/proyectos/${item.id}"`));
  }
});

test("only null or HTTP 404 are treated as missing projects", async () => {
  for (const response of [Response.json(null), new Response(null, { status: 404 })]) {
    const data = loadData(async () => response);
    assert.equal(await data.getProyectoFundacion(projectId), null);
  }
  const data = loadData(async () => new Response(null, { status: 403 }));
  await assert.rejects(data.getProyectoFundacion(projectId), /No se pudieron cargar/);
});

test("empty lists are valid but service failures never become empty lists", async () => {
  assert.equal((await loadData(async () => Response.json([])).getProyectosFundacion()).length, 0);
  for (const response of [
    new Response(null, { status: 500 }),
    Response.json({ detail: "failure" }),
    new Response("not json"),
    Response.json([{ ...project, fecha_creacion: "not a date" }]),
  ]) {
    await assert.rejects(loadData(async () => response).getProyectosFundacion());
  }
  await assert.rejects(loadData(async () => { throw new TypeError("offline"); }).getProyectosFundacion(), /conectar/);
});

test("detail rejects a response for another project", async () => {
  await assert.rejects(loadData(async () => Response.json({ ...project, id: otherProjectId })).getProyectoFundacion(projectId), /formato invalido/);
});

test("project IDs must be UUID strings, never numeric IDs or arbitrary paths", async () => {
  assert.equal(validation.proyectoSchema.safeParse(project).success, true);
  for (const id of [7, "7", "", "not-a-uuid", "../crear", "550e8400-e29b-41d4-a716"]) {
    assert.equal(validation.proyectoSchema.safeParse({ ...project, id }).success, false);
    let called = false;
    const data = loadData(async () => { called = true; return Response.json(project); });
    await assert.rejects(data.getProyectoFundacion(id));
    assert.equal(called, false);
  }
});

test("UUID comparison accepts case differences without converting IDs to numbers", async () => {
  const uppercase = projectId.toUpperCase();
  const data = loadData(async (url) => {
    assert.equal(url, `http://api.test/fundaciones/proyectos/${uppercase}`);
    return Response.json(project);
  });
  assert.equal((await data.getProyectoFundacion(uppercase)).id, projectId);
});

test("request denies volunteers, expired sessions and missing tokens before fetching", async () => {
  for (const [session, token] of [
    [{ role: 1 }, "test-token"],
    [null, "test-token"],
    [{ role: 2 }, null],
  ]) {
    let called = false;
    const data = loadData(async () => { called = true; return Response.json([]); }, session, token);
    await assert.rejects(data.requestProyectos("/fundaciones/proyectos/crear", { method: "POST" }), /Solo las fundaciones/);
    assert.equal(called, false);
  }
});

function loadAction(requestProyectos, revalidated = []) {
  return loadModule("src/lib/actions/proyectos.ts", {
    "next/cache": { revalidatePath: (value) => revalidated.push(value) },
    "next/navigation": { redirect: (value) => { throw new Error(`redirect:${value}`); } },
    "@/lib/data/proyectos": { requestProyectos },
    "@/lib/validations/proyecto": validation,
  });
}

function form(nombre = "Huertas") {
  const data = new FormData();
  data.set("nombre", nombre);
  data.set("descripcion", "");
  data.set("fecha_creacion", "2020-02-29");
  return data;
}

test("create posts the supplied fields, revalidates and redirects after success", async () => {
  const revalidated = [];
  const action = loadAction(async (url, options) => {
    assert.equal(url, "/fundaciones/proyectos/crear");
    assert.equal(options.method, "POST");
    assert.ok(options.body instanceof FormData);
    assert.equal(options.body.get("nombre"), "Huertas");
    assert.equal(options.body.get("fecha_creacion"), "2020-02-29T00:00:00.000Z");
    assert.equal(options.body.has("descripcion"), false);
    assert.equal(options.body.has("foto"), false);
    assert.equal(options.body.has("foto_cabeza"), false);
    assert.equal(options.body.has("foto_url"), false);
    return Response.json({ id: otherProjectId }, { status: 201 });
  }, revalidated);
  await assert.rejects(action.crearProyecto({}, form()), /redirect:\/proyectos\?creado=1/);
  assert.deepEqual(revalidated, ["/proyectos"]);
});

test("creation sends both images intact and the selected date as multipart fields", async () => {
  const input = form();
  input.set("descripcion", "Descripcion del proyecto");
  input.set("foto", png());
  input.set("foto_cabeza", png());
  const action = loadAction(async (_url, { body }) => {
    assert.ok(body instanceof FormData);
    assert.equal(body.get("descripcion"), "Descripcion del proyecto");
    assert.equal(body.get("fecha_creacion"), "2020-02-29T00:00:00.000Z");
    for (const field of ["foto", "foto_cabeza"]) {
      assert.equal(body.get(field).name, "photo.png");
      assert.equal(body.get(field).type, "image/png");
      assert.deepEqual(new Uint8Array(await body.get(field).arrayBuffer()), pngBytes);
    }
    assert.equal(body.has("foto_cabeza_url"), false);
    return Response.json({}, { status: 201 });
  });
  await assert.rejects(action.crearProyecto({}, input), /redirect:/);
});

test("invalid images and future dates never reach the API", async () => {
  for (const field of ["foto", "foto_cabeza", "fecha_creacion"]) {
    const input = form();
    input.set(field, field === "fecha_creacion" ? "2099-01-01" : new File(["bad"], "fake.png", { type: "image/png" }));
    let called = false;
    const action = loadAction(async () => { called = true; });
    const state = await action.crearProyecto({}, input);
    assert.ok(state.errors[field]);
    assert.equal(called, false);
  }
});

test("invalid creation shows field errors without calling the service", async () => {
  let called = false;
  const action = loadAction(async () => { called = true; });
  const state = await action.crearProyecto({}, form(" "));
  assert.ok(state.errors.nombre.length > 0);
  assert.equal(state.values.nombre, " ");
  assert.equal(called, false);
});

test("failed creation preserves input and never redirects or revalidates", async () => {
  for (const status of [401, 403, 413, 422, 500]) {
    const revalidated = [];
    const action = loadAction(async () => new Response(null, { status }), revalidated);
    const state = await action.crearProyecto({}, form());
    assert.ok(state.message);
    assert.equal(state.values.nombre, "Huertas");
    assert.deepEqual(revalidated, []);
  }
  const action = loadAction(async () => { throw new Error("No autorizado."); });
  assert.equal((await action.crearProyecto({}, form())).message, "No autorizado.");
});
