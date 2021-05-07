import { FunctionComponent, useEffect, useRef } from "react";

export type GLCanvasProps = {
    contextCreated: (context: WebGL2RenderingContext) => void,
    width: string,
    height: string
};

export const GLCanvas: FunctionComponent<GLCanvasProps> = ({ contextCreated, width, height }) => {
    let ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let ctx = ref.current?.getContext('webgl2');
        if (!ctx) throw new Error("Unsupported Version of WebGL");
        contextCreated(ctx);
    }, [ref, contextCreated]);

    return <canvas ref={ref} style={{ width: width, height: height }}></canvas>
}