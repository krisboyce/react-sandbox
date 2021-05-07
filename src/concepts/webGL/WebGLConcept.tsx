import { Button, makeStyles, TextField, Typography, useTheme } from "@material-ui/core";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { GLCanvas } from "./GLCanvas";
import { createProgram, createShader } from "./util/glUtils";

const defaultVert = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

const defaultFrag = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

const useStyles = makeStyles(theme => ({
    content: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',

    },
    canvas: {
        margin: theme.spacing(4),
        flex: 1.5,
    },
    sources: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    }
}));

export function WebGLConcept() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [gl, setGl] = useState<WebGL2RenderingContext | null>(null);
    const [vertexShader, setVertexShader] = useState(defaultVert);
    const [fragmentShader, setFragementShader] = useState(defaultFrag);

    function compile() {
        if (!gl) return;
        let vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
        if (!vertex) return;
        let fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
        if (!fragment) return;

        let program = createProgram(gl, vertex, fragment);
        gl.useProgram(program);
    }

    function initGL(glContext: WebGL2RenderingContext) {
        setGl(glContext);
        glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
        glContext.clearColor(0, 0, 0, 1);
        glContext.clear(glContext.COLOR_BUFFER_BIT);
    }

    useEffect(() => {
        compile();
    });

    const width = 600;
    const height = width * (9 / 16);
    return <div className={classes.content}>
        <div className={classes.canvas}>
            <GLCanvas width={width + 'px'} height={height + 'px'} contextCreated={initGL} />
            <VertexForm onSubmit={(vertex) => { console.log(vertex) }} />
        </div>
        <div className={classes.sources}>
            <Typography variant='h4'>Vertex Shader</Typography>
            <TextField variant='outlined' multiline value={vertexShader} onChange={(e) => setVertexShader(e.target.value)} />
            <Typography variant='h4'>Fragment Shader</Typography>
            <TextField variant='outlined' multiline value={fragmentShader} onChange={(e) => setFragementShader(e.target.value)} />
            <Button onClick={compile}>Compile</Button>
        </div>
    </div>
}

type Vertex = {
    x: Number,
    y: Number
}

const VertexForm: FunctionComponent<{ onSubmit: (vertex: Vertex) => void }> = ({ onSubmit }) => {
    const [vertex, setVertex] = useState<Vertex>({ x: 0, y: 0 });
    let xRef = useRef<any>();
    let yRef = useRef<any>();

    function onXChange(x: string) {
        let parsed = Number.parseFloat(x);
        if (isNaN(parsed)) parsed = 0;
        if (xRef.current) xRef.current.value = parsed;
        setVertex({ ...vertex, x: parsed });
    }

    function onYChange(y: string) {
        let parsed = Number.parseFloat(y);
        if (isNaN(parsed)) parsed = 0;
        if (yRef.current) yRef.current.value = parsed;
        setVertex({ ...vertex, y: parsed });
    }

    return <form>
        <TextField label="x" type="text" defaultValue={vertex.x} inputRef={xRef} onBlur={(e) => onXChange(e.target.value)} />
        <TextField label="y" defaultValue={vertex.y} inputRef={yRef} onBlur={(e) => onYChange(e.target.value)} />
        <Button onClick={() => onSubmit(vertex)}>Add Vertex</Button>
    </form>
}