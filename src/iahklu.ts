

namespace C {

  type NodePropType = number | string | boolean | Date
  type NodeProps = Record<string, NodePropType>
  type RelProps = any // -- TODO

  export interface AST {
    type: string
  }

  export interface NodeAST extends AST {
    type: 'Node'
    data: {
      ref: string | null | undefined
      type: string | null | undefined
      props: NodePropsAST  | undefined
    }
  }

  export interface RelAST extends AST {
    type: 'Rel'
    data: {
      ref: string | null | undefined
      type: string | null | undefined
      props: RelPropsAST  | undefined
    }
  }

  export interface LeftRelAST extends AST {
    type: 'LeftRel'
    data: {
      ref: string | null | undefined
      type: string | null | undefined
      props: RelPropsAST | undefined
    }
  }

  export interface RightRelAST extends AST {
    type: 'RightRel'
    data: {
      ref: string | null | undefined
      type: string | null | undefined
      props: RelPropsAST | undefined
    }
  }

  export interface PathAST extends AST {
    type: 'Path'
    data: Array<NodeAST | RelAST | LeftRelAST | RightRelAST>
  }

  export interface NodePropsAST extends AST {
    type: 'NodeProps',
    data: NodeProps
  }

  export interface RelPropsAST extends AST {
    type: 'RelProps',
    data: RelProps
  }

  export interface TupleAST extends AST {
    type: 'Tuple'
    data: Array<AST | string>
  }

  export interface CreateConstraintOnAST extends AST {
    type: 'CreateConstraintOn'
    data: NodeAST | PathAST
    name: string
    idempotent?: boolean
    ifNotExists (): CreateConstraintOnAST
  }


  export function asNodePropsAST (props: NodeProps | undefined): NodePropsAST | undefined {
    if (props) {
      return {
        type: 'NodeProps',
        data: props
      }
    }
  }

  export function asRelPropsAST (props: RelProps | undefined): RelPropsAST | undefined {
    if (props) {
      return {
        type: 'RelProps',
        data: props
      }
    }
  }

  export function Node (ref?: string | null, type?: string | null, props?: NodeProps): NodeAST {
    return {
      type: 'Node',
      data: { ref, type, props: asNodePropsAST(props) }
    }
  }

  export function Rel (ref?: string | null, type?: string | null, props?: RelProps): RelAST {
    return {
      type: 'Rel',
      data: { ref, type, props: asRelPropsAST(props) }
    }
  }

  export function LeftRel(ref?: string | null, type?: string | null, props?: RelProps): LeftRelAST {
    return {
      type: 'LeftRel',
      data: { ref, type, props: asRelPropsAST(props) }
    }
  }

  export function RightRel (ref?: string | null, type?: string | null, props?: RelProps): RightRelAST {
    return {
      type: 'RightRel',
      data: { ref, type, props: asRelPropsAST(props) }
    }
  }

  export function Path (parts: Array<NodeAST | RelAST | LeftRelAST | RightRelAST>): PathAST {
    return {
      type: 'Path',
      data: parts
    }
  }

  export function Tuple (parts: Array<AST | string>): TupleAST {
    return {
      type: 'Tuple',
      data: parts
    }
  }

  export function CreateConstraintOn (name: string, parts: NodeAST | PathAST): CreateConstraintOnAST {
    return {
      type: 'CreateConstraintOn',
      data: parts,
      name,
      ifNotExists () {
        this.idempotent = true
        return this
      }
    }
  }

  export function compileNode (ast: NodeAST): string {
    let message = '('

    const { ref, type, props } = ast.data

    if (ref) {
      message += ref
    }

    if (type) {
      message += `: ${type}`
    }

    if (props) {
      message += ' ' + compile(props)
    }

    message += ')'

    return message
  }

  export function compileRel (ast: RelAST | LeftRelAST | RightRelAST): string {
    let message = '-['

    const { ref, type, props } = ast.data

    if (ref) {
      message += ref
    }

    if (type) {
      message += `: ${type}`
    }

    if (props) {
      message += ' ' + compile(props)
    }

    return `${message}]-`
  }

  export function compileLeftRel (ast: LeftRelAST): string {
    return `<${compileRel(ast)}`
  }

  export function compileRightRel (ast: RightRelAST): string {
    return `${compileRel(ast)}>`
  }

  export function compilePath (ast: PathAST): string {
    return ast.data.map(compile).join(' ')
  }

  export function compileNodeProps (ast: NodePropsAST): string {
    let message = '{'
    let ran = false

    for (const [key, val] of Object.entries(ast.data)) {
      ran = true
      message += ` ${key}: ${val},`
    }

    if (ran) {
      message = message.slice(0, -1)
    }

    message += ' }'

    return message
  }

  export function compileTuple (ast: TupleAST): string {
    return '(' + ast.data.map(compile).join(', ') + ')'
  }

  export function compileRelProps (ast: RelPropsAST): string {
    let message = '{'
    let ran = false

    for (const [key, val] of Object.entries(ast.data)) {
      ran = true
      message += ` ${key}: ${val},`
    }

    if (ran) {
      message = message.slice(0, -1)
    }

    message += ' }'

    return message
  }

  export function compileCreateConstraintOn (ast: CreateConstraintOnAST): string {
    let message = 'CREATE CONSTRAINT '

    if (ast.idempotent) {
      message += 'IF NOT EXISTS '
    }

    message += ast.name + ' ON '

    message += compile(ast.data)

    return message
  }

  export function throwCompilationError (ast: any): never {
    throw new Error('TODO' + JSON.stringify(ast, null, 2))
  }

  export function compile (ast: AST | AST[] | string): string {
    if (typeof ast === 'string') {
      return ast
    } else if (Array.isArray(ast)) {
      return ast.map(compile).join('\n')
    } else if (ast.type === 'Node') {
      return compileNode(ast as NodeAST)
    } else if (ast.type === 'Rel') {
      return compileRel(ast as RelAST)
    } else if (ast.type === 'LeftRel') {
      return compileLeftRel(ast as LeftRelAST)
    } else if (ast.type === 'RightRel') {
      return compileRightRel(ast as RightRelAST)
    } else if (ast.type === 'Path') {
      return compilePath(ast as PathAST)
    } else if (ast.type === 'NodeProps') {
      return compileNodeProps(ast as NodePropsAST)
    } else if (ast.type === 'Tuple') {
      return compileTuple(ast as TupleAST)
    } else if (ast.type === 'RelProps') {
      return compileRelProps(ast as RelPropsAST)
    } else if (ast.type === 'CreateConstraintOn') {
      return compileCreateConstraintOn(ast as CreateConstraintOnAST)
    } else {
      throwCompilationError(ast)
    }
  }
}

const query = C.compile([

  C.CreateConstraintOn('bing', C.Node('book', 'Book'))
    .ifNotExists()

])

console.log(query)
