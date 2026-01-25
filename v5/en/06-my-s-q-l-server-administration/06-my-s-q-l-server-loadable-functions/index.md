## 5.6 Funções Carregáveis do Servidor MySQL

[5.6.1 Instalando e Desinstalando Funções Carregáveis](function-loading.html)

[5.6.2 Obtendo Informações Sobre Funções Carregáveis](obtaining-loadable-function-information.html)

O MySQL suporta *loadable functions* (funções carregáveis), ou seja, funções que não são nativas (*built-in*) mas que podem ser carregadas em *runtime* (seja durante a inicialização ou posteriormente) para estender as capacidades do servidor, ou descarregadas para remover capacidades. Para uma tabela que descreve as *loadable functions* disponíveis, consulte [Seção 12.2, “Referência de Funções Carregáveis”](loadable-function-reference.html "12.2 Referência de Funções Carregáveis"). As *loadable functions* contrastam com as funções nativas (*built-in*), que são implementadas como parte do servidor e estão sempre disponíveis; para uma tabela, consulte [Seção 12.1, “Referência de Funções e Operadores Nativos”](built-in-function-reference.html "12.1 Referência de Funções e Operadores Nativos").

Nota

As *loadable functions* eram anteriormente conhecidas como funções definidas pelo usuário (*user-defined functions* ou UDFs). Essa terminologia era um tanto inadequada (*misnomer*), pois "definida pelo usuário" também pode se aplicar a outros tipos de funções, como *stored functions* (um tipo de objeto armazenado escrito usando SQL) e funções nativas adicionadas pela modificação do código-fonte do servidor.

As distribuições MySQL incluem *loadable functions* que implementam, total ou parcialmente, estas capacidades do servidor:

* O MySQL Enterprise Edition inclui funções que realizam operações de criptografia baseadas na biblioteca OpenSSL. Consulte [Seção 6.6, “Criptografia MySQL Enterprise”](enterprise-encryption.html "6.6 Criptografia MySQL Enterprise").

* O MySQL Enterprise Edition inclui funções que fornecem uma API de nível SQL para operações de mascaramento e desidentificação. Consulte [Seção 6.5.1, “Elementos de Mascaramento e Desidentificação de Dados do MySQL Enterprise”](data-masking-elements.html "6.5.1 Elementos de Mascaramento e Desidentificação de Dados do MySQL Enterprise").

* O MySQL Enterprise Edition inclui *audit logging* (registro de auditoria) para monitoramento e registro de atividade de conexão e Query. Consulte [Seção 6.4.5, “Auditoria MySQL Enterprise”](audit-log.html "6.4.5 Auditoria MySQL Enterprise").

* O MySQL Enterprise Edition inclui um recurso de *firewall* que implementa um *firewall* de nível de aplicação para permitir que administradores de Database permitam ou neguem a execução de comandos SQL com base na correspondência de padrões para comandos aceitos. Consulte [Seção 6.4.6, “Firewall MySQL Enterprise”](firewall.html "6.4.6 Firewall MySQL Enterprise").

* Um reescritor de Query (*query rewriter*) examina os comandos recebidos pelo MySQL Server e, possivelmente, os reescreve antes que o servidor os execute. Consulte [Seção 5.5.4, “O Plugin de Reescrever Query Rewriter”](rewriter-query-rewrite-plugin.html "5.5.4 O Plugin de Reescrever Query Rewriter")

* Version Tokens (Tokens de Versão) permite a criação e sincronização em torno de *tokens* de servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Consulte [Seção 5.5.5, “Version Tokens”](version-tokens.html "5.5.5 Version Tokens").

* O MySQL Keyring fornece armazenamento seguro para informações confidenciais. Consulte [Seção 6.4.4, “O MySQL Keyring”](keyring.html "6.4.4 O MySQL Keyring").

* Um serviço de *locking* fornece uma interface de *locking* para uso em aplicações. Consulte [Seção 5.5.6.1, “O Serviço de Locking”](locking-service.html "5.5.6.1 O Serviço de Locking").

As seções a seguir descrevem como instalar e desinstalar *loadable functions*, e como determinar em *runtime* quais *loadable functions* estão instaladas e obter informações sobre elas.

Para informações sobre a escrita de *loadable functions*, consulte [Adicionando Funções ao MySQL](/doc/extending-mysql/5.7/en/adding-functions.html).