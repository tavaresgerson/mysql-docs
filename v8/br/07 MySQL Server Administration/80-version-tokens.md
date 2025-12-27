### 7.6.6 Tokens de Versão

O MySQL inclui Tokens de Versão, uma funcionalidade que permite a criação e sincronização de tokens de servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados.

A interface dos Tokens de Versão tem essas características:

* Os tokens de versão são pares que consistem em um nome que serve como chave ou identificador, mais um valor.
* Os tokens de versão podem ser bloqueados. Uma aplicação pode usar bloqueios de tokens para indicar a outras aplicações cooperantes que os tokens estão em uso e não devem ser modificados.
* As listas de tokens de versão são estabelecidas por servidor (por exemplo, para especificar a atribuição do servidor ou o estado operacional). Além disso, uma aplicação que se comunica com um servidor pode registrar sua própria lista de tokens que indicam o estado que o servidor deve estar. Uma instrução SQL enviada pela aplicação para um servidor que não está no estado requerido produz um erro. Esse é um sinal para a aplicação que ela deve procurar um servidor diferente no estado requerido para receber a instrução SQL.

As seções a seguir descrevem os elementos dos Tokens de Versão, discutem como instalá-los e usá-los, e fornecem informações de referência para seus elementos.