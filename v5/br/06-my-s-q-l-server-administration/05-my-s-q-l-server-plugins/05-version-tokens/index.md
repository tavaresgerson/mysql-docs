### 5.5.5 Tokens de versão

5.5.5.1 Tokens de versão Elementos

5.5.5.2 Instalação ou Desinstalação de Tokens de Versão

5.5.5.3 Uso de Tokens de Versão

Referência de Tokens de Versão

O MySQL inclui Tokens de Versão, uma funcionalidade que permite a criação e sincronização de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados.

A interface dos Tokens de Versão tem essas características:

- Os tokens de versão são pares que consistem em um nome que serve como chave ou identificador, mais um valor.

- Os tokens de versão podem ser bloqueados. Uma aplicação pode usar bloqueios de tokens para indicar a outras aplicações que cooperam que os tokens estão em uso e não devem ser modificados.

- As listas de tokens de versão são estabelecidas por servidor (por exemplo, para especificar a atribuição do servidor ou o estado operacional). Além disso, um aplicativo que se comunica com um servidor pode registrar sua própria lista de tokens que indicam o estado que o servidor deve estar. Uma instrução SQL enviada pelo aplicativo para um servidor que não está no estado necessário produz um erro. Esse é um sinal para o aplicativo que ele deve procurar um servidor diferente no estado necessário para receber a instrução SQL.

As seções a seguir descrevem os elementos dos Tokens de Versão, discutem como instalá-los e usá-los, e fornecem informações de referência para seus elementos.
