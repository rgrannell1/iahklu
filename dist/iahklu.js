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
    function Tuple(parts) {
        return {
            type: 'Tuple',
            data: parts
        };
    }
    C.Tuple = Tuple;
    function CreateConstraintOn(name, parts) {
        return {
            type: 'CreateConstraintOn',
            data: parts,
            name,
            ifNotExists() {
                this.idempotent = true;
                return this;
            }
        };
    }
    C.CreateConstraintOn = CreateConstraintOn;
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
    function compileCreateConstraintOn(ast) {
        let message = 'CREATE CONSTRAINT ';
        if (ast.idempotent) {
            message += 'IF NOT EXISTS ';
        }
        message += ast.name + ' ON ';
        message += compile(ast.data);
        return message;
    }
    C.compileCreateConstraintOn = compileCreateConstraintOn;
    function throwCompilationError(ast) {
        throw new Error('TODO' + JSON.stringify(ast, null, 2));
    }
    C.throwCompilationError = throwCompilationError;
    function compile(ast) {
        if (typeof ast === 'string') {
            return ast;
        }
        else if (Array.isArray(ast)) {
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
        else if (ast.type === 'CreateConstraintOn') {
            return compileCreateConstraintOn(ast);
        }
        else {
            throwCompilationError(ast);
        }
    }
    C.compile = compile;
})(C || (C = {}));
const query = C.compile([
    C.CreateConstraintOn('bing', C.Node('book', 'Book'))
        .ifNotExists()
]);
console.log(query);
//# sourceMappingURL=iahklu.js.map