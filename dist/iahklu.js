"use strict";
var C;
(function (C) {
    function asNodePropsAST(props) {
        if (props) {
            return {
                type: 'NodeProps',
                data: props
            };
        }
    }
    C.asNodePropsAST = asNodePropsAST;
    function asRelPropsAST(props) {
        if (props) {
            return {
                type: 'RelProps',
                data: props
            };
        }
    }
    C.asRelPropsAST = asRelPropsAST;
    function Node(ref, type, props) {
        return {
            type: 'Node',
            data: { ref, type, props: asNodePropsAST(props) }
        };
    }
    C.Node = Node;
    function Rel(ref, type, props) {
        return {
            type: 'Rel',
            data: { ref, type, props: asRelPropsAST(props) }
        };
    }
    C.Rel = Rel;
    function LeftRel(ref, type, props) {
        return {
            type: 'LeftRel',
            data: { ref, type, props: asRelPropsAST(props) }
        };
    }
    C.LeftRel = LeftRel;
    function RightRel(ref, type, props) {
        return {
            type: 'RightRel',
            data: { ref, type, props: asRelPropsAST(props) }
        };
    }
    C.RightRel = RightRel;
    function Path(parts) {
        return {
            type: 'Path',
            data: parts
        };
    }
    C.Path = Path;
    function compileNode(ast) {
        let message = '(';
        const { ref, type, props } = ast.data;
        if (ref) {
            message += ref;
        }
        if (type) {
            message += `: ${type}`;
        }
        if (props) {
            message += ' ' + compile(props);
        }
        message += ')';
        return message;
    }
    C.compileNode = compileNode;
    function compileRel(ast) {
        let message = '-[';
        const { ref, type, props } = ast.data;
        if (ref) {
            message += ref;
        }
        if (type) {
            message += `: ${type}`;
        }
        if (props) {
            message += ' ' + compile(props);
        }
        return `${message}]-`;
    }
    C.compileRel = compileRel;
    function compileLeftRel(ast) {
        return `<${compileRel(ast)}`;
    }
    C.compileLeftRel = compileLeftRel;
    function compileRightRel(ast) {
        return `${compileRel(ast)}>`;
    }
    C.compileRightRel = compileRightRel;
    function compilePath(ast) {
        return ast.data.map(compile).join(' ');
    }
    C.compilePath = compilePath;
    function compileNodeProps(ast) {
        let message = '{';
        let ran = false;
        for (const [key, val] of Object.entries(ast.data)) {
            ran = true;
            message += ` ${key}: ${val},`;
        }
        if (ran) {
            message = message.slice(0, -1);
        }
        message += ' }';
        return message;
    }
    C.compileNodeProps = compileNodeProps;
    function compileTuple(ast) {
        return '(' + ast.data.map(compile).join(', ') + ')';
    }
    C.compileTuple = compileTuple;
    function compileRelProps(ast) {
        let message = '{';
        let ran = false;
        for (const [key, val] of Object.entries(ast.data)) {
            ran = true;
            message += ` ${key}: ${val},`;
        }
        if (ran) {
            message = message.slice(0, -1);
        }
        message += ' }';
        return message;
    }
    C.compileRelProps = compileRelProps;
    function compile(ast) {
        if (Array.isArray(ast)) {
            return ast.map(compile).join('\n');
        }
        else if (ast.type === 'Node') {
            return compileNode(ast);
        }
        else if (ast.type === 'Rel') {
            return compileRel(ast);
        }
        else if (ast.type === 'LeftRel') {
            return compileLeftRel(ast);
        }
        else if (ast.type === 'RightRel') {
            return compileRightRel(ast);
        }
        else if (ast.type === 'Path') {
            return compilePath(ast);
        }
        else if (ast.type === 'NodeProps') {
            return compileNodeProps(ast);
        }
        else if (ast.type === 'Tuple') {
            return compileTuple(ast);
        }
        else if (ast.type === 'RelProps') {
            return compileRelProps(ast);
        }
        else {
            throw new Error('TODO' + JSON.stringify(ast, null, 2));
        }
    }
    C.compile = compile;
})(C || (C = {}));
const query = C.compile([
    C.Path([
        C.Node('xx', 'DRIVE_TO', { a: 0, b: 1 }),
        C.LeftRel('rel', 'DRIVES_TO', { c: 2 }),
        C.Node('zz', 'DRIVE_TO', {}),
    ])
]);
console.log(query);
//# sourceMappingURL=iahklu.js.map