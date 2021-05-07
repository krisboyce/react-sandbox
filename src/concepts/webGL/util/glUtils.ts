export function createShader(
    glContext: WebGL2RenderingContext, type: number,
    source: string): WebGLShader|null {
  if (!glContext) return null;
  var shader = glContext.createShader(type);
  if (!shader) return null;

  glContext.shaderSource(shader, source);
  glContext.compileShader(shader);
  var success = glContext?.getShaderParameter(shader, glContext.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(glContext.getShaderInfoLog(shader));
  glContext.deleteShader(shader);

  return null;
}

export function createProgram(
    glContext: WebGL2RenderingContext, vertexShader: WebGLShader,
    fragmentShader: WebGLShader): WebGLProgram|null {
  var program = glContext.createProgram();

  if (!program) {
    return null;
  }

  glContext.attachShader(program, vertexShader);
  glContext.attachShader(program, fragmentShader);

  glContext.linkProgram(program);

  var success = glContext.getProgramParameter(program, glContext.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(glContext.getProgramInfoLog(program));
  glContext.deleteProgram(program);

  return null;
}