## 7.7 Funções carregáveis do MySQL Server

7.7.1 Instalação e Desinstalação de Funções Carregáveis

7.7.2 Obter informações sobre funções carregáveis

O MySQL suporta funções carregáveis, ou seja, funções que não são integradas, mas podem ser carregadas em tempo de execução (durante a inicialização ou posteriormente) para ampliar as capacidades do servidor, ou descarregadas para remover capacidades. Para uma tabela que descreve as funções carregáveis disponíveis, consulte a Seção 14.2, “Referência de Funções Carregáveis”. As funções carregáveis contrastam com as funções integradas (nativas), que são implementadas como parte do servidor e estão sempre disponíveis; para uma tabela, consulte a Seção 14.1, “Referência de Funções e Operadores Integrados”.

Nota

As funções carregáveis eram anteriormente conhecidas como funções definidas pelo usuário (UDFs). Essa terminologia era um pouco equivocada, pois "definida pelo usuário" também pode se aplicar a outros tipos de funções, como funções armazenadas (um tipo de objeto armazenado escrito usando SQL) e funções nativas adicionadas modificando o código-fonte do servidor.

As distribuições do MySQL incluem funções carregáveis que implementam, total ou parcialmente, essas capacidades do servidor:

- A Replicação em Grupo permite que você crie um serviço MySQL distribuído altamente disponível em um grupo de instâncias do servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de participação em grupo integrados. Veja o Capítulo 20, *Replicação em Grupo*.

- A Edição Empresarial do MySQL inclui funções que realizam operações de criptografia com base na biblioteca OpenSSL. Consulte a Seção 8.6, “Criptografia Empresarial do MySQL”.

- A Edição Empresarial do MySQL inclui funções que fornecem uma API de nível SQL para operações de mascaramento e desidentificação. Consulte os elementos de mascaramento e desidentificação de dados do MySQL Enterprise.

- A Edição Empresarial do MySQL inclui registro de auditoria para monitoramento e registro de atividades de conexão e consulta. Consulte a Seção 8.4.5, “Auditoria do MySQL Empresarial”, e a Seção 8.4.6, “O Componente de Mensagem de Auditoria”.

- A Edição Empresarial do MySQL inclui uma capacidade de firewall que implementa um firewall de nível de aplicativo para permitir que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com padrões para instruções aceitas. Veja a Seção 8.4.7, “Firewall Empresarial do MySQL”.

- Um reescritor de consultas examina as declarações recebidas pelo MySQL Server e, possivelmente, as reescreve antes de o servidor executá-las. Veja a Seção 7.6.4, “O Plugin de Reescrita de Consultas do Rewriter”

- O Token de Versão permite a criação e sincronização de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Consulte a Seção 7.6.6, “Token de Versão”.

- O Keyring do MySQL oferece armazenamento seguro para informações sensíveis. Consulte a Seção 8.4.4, “O Keyring do MySQL”.

- Um serviço de bloqueio fornece uma interface de bloqueio para uso de aplicativos. Consulte a Seção 7.6.9.1, “O Serviço de Bloqueio”.

- Uma função fornece acesso a atributos de consulta. Veja a Seção 11.6, “Atributos de Consulta”.

As seções a seguir descrevem como instalar e desinstalar funções carregáveis e como determinar, em tempo de execução, quais funções carregáveis estão instaladas e obter informações sobre elas.

Em alguns casos, uma função carregável é carregada instalando o componente que implementa a função, em vez de carregá-la diretamente. Para obter detalhes sobre uma função carregável específica, consulte as instruções de instalação do recurso do servidor que a inclui.

Para obter informações sobre como escrever funções carregáveis, consulte Adicionar funções ao MySQL.
