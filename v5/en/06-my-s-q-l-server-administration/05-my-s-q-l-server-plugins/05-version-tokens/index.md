### 5.5.5 Tokens de Versão

[5.5.5.1 Elementos dos Tokens de Versão](version-tokens-elements.html)

[5.5.5.2 Instalação e Desinstalação de Tokens de Versão](version-tokens-installation.html)

[5.5.5.3 Utilizando Tokens de Versão](version-tokens-usage.html)

[5.5.5.4 Referência de Tokens de Versão](version-tokens-reference.html)

O MySQL inclui Tokens de Versão, um recurso que permite a criação e a sincronização em torno de tokens do server que as aplicações podem usar para prevenir o acesso a dados incorretos ou desatualizados.

A interface de Tokens de Versão possui estas características:

* Tokens de versão são pares que consistem em um nome que serve como uma key ou identificador, mais um valor.

* Tokens de versão podem ser bloqueados (locked). Uma aplicação pode usar locks de token para indicar a outras aplicações cooperantes que os tokens estão em uso e não devem ser modificados.

* Listas de tokens de versão são estabelecidas por server (por exemplo, para especificar a atribuição do server ou o estado operacional). Além disso, uma aplicação que se comunica com um server pode registrar sua própria lista de tokens que indica o estado em que ela exige que o server esteja. Uma instrução SQL enviada pela aplicação a um server que não esteja no estado requerido produz um error. Este é um sinal para a aplicação de que ela deve buscar um server diferente no estado requerido para receber a instrução SQL.

As seções a seguir descrevem os elementos dos Tokens de Versão, discutem como instalá-lo e usá-lo, e fornecem informações de referência para seus elementos.