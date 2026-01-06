## 5.6 Funções carregáveis do MySQL Server

5.6.1 Instalação e Desinstalação de Funções Carregáveis

5.6.2 Obter informações sobre funções carregáveis

O MySQL suporta funções carregáveis, ou seja, funções que não são integradas, mas podem ser carregadas em tempo de execução (durante a inicialização ou posteriormente) para ampliar as capacidades do servidor, ou descarregadas para remover capacidades. Para uma tabela que descreve as funções carregáveis disponíveis, consulte Seção 12.2, “Referência de Funções Carregáveis”. As funções carregáveis contrastam com as funções integradas (nativas), que são implementadas como parte do servidor e estão sempre disponíveis; para uma tabela, consulte Seção 12.1, “Referência de Funções e Operadores Integrados”.

Nota

As funções carregáveis eram anteriormente conhecidas como funções definidas pelo usuário (UDFs). Essa terminologia era um pouco equivocada, pois "definida pelo usuário" também pode se aplicar a outros tipos de funções, como funções armazenadas (um tipo de objeto armazenado escrito usando SQL) e funções nativas adicionadas modificando o código-fonte do servidor.

As distribuições do MySQL incluem funções carregáveis que implementam, total ou parcialmente, essas capacidades do servidor:

- A Edição Empresarial do MySQL inclui funções que realizam operações de criptografia com base na biblioteca OpenSSL. Consulte Seção 6.6, “Criptografia Empresarial do MySQL”.

- A Edição Empresarial do MySQL inclui funções que fornecem uma API de nível SQL para operações de mascaramento e desidentificação. Consulte Seção 6.5.1, “Elementos de Mascaramento e Desidentificação de Dados do MySQL Empresarial”.

- A Edição Empresarial do MySQL inclui registro de auditoria para monitoramento e registro de atividades de conexão e consulta. Consulte Seção 6.4.5, “Auditoria do MySQL Empresarial”.

- A Edição Empresarial do MySQL inclui uma capacidade de firewall que implementa um firewall de nível de aplicativo para permitir que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com padrões para instruções aceitas. Veja Seção 6.4.6, “Firewall Empresarial do MySQL”.

- Um reescritor de consultas examina as declarações recebidas pelo MySQL Server e, possivelmente, as reescreve antes que o servidor as execute. Veja Seção 5.5.4, “O Plugin de Reescrita de Consultas de Reescritor”

- O Tokens de versão permite a criação e sincronização de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Consulte Seção 5.5.5, “Tokens de versão”.

- O Keyring do MySQL oferece armazenamento seguro para informações sensíveis. Consulte Seção 6.4.4, “O Keyring do MySQL”.

- Um serviço de bloqueio fornece uma interface de bloqueio para uso de aplicativos. Consulte Seção 5.5.6.1, “O Serviço de Bloqueio”.

As seções a seguir descrevem como instalar e desinstalar funções carregáveis e como determinar, em tempo de execução, quais funções carregáveis estão instaladas e obter informações sobre elas.

Para obter informações sobre como escrever funções carregáveis, consulte Adicionar funções ao MySQL.
