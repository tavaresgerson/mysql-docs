### 7.6.6 Tokens de versão

O MySQL inclui Version Tokens, um recurso que permite a criação e sincronização em torno de tokens de servidor que os aplicativos podem usar para evitar o acesso a dados incorretos ou desatualizados.

A interface de Tokens de Versão tem estas características:

- Os tokens de versão são pares compostos por um nome que serve como chave ou identificador, mais um valor.
- Os tokens de versão podem ser bloqueados. Um aplicativo pode usar bloqueios de token para indicar a outros aplicativos cooperantes que os tokens estão em uso e não devem ser modificados.
- As listas de tokens de versão são estabelecidas por servidor (por exemplo, para especificar a atribuição do servidor ou o estado operacional). Além disso, um aplicativo que se comunica com um servidor pode registrar sua própria lista de tokens que indicam o estado em que ele requer que o servidor esteja. Uma instrução SQL enviada pelo aplicativo para um servidor que não esteja no estado necessário produz um erro.

As seções a seguir descrevem os elementos de Version Tokens, discutem como instalá-lo e usá-lo e fornecem informações de referência para seus elementos.
