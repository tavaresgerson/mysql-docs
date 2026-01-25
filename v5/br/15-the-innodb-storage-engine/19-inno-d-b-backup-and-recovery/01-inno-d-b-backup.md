### 14.19.1 InnoDB Backup

A chave para um gerenciamento seguro de Database é realizar Backups regulares. Dependendo do seu volume de dados, número de MySQL Servers e carga de trabalho do Database, você pode usar estas técnicas de Backup, sozinhas ou em combinação: Hot Backup com MySQL Enterprise Backup; Cold Backup copiando arquivos enquanto o MySQL Server está desligado; Logical Backup com **mysqldump** para volumes de dados menores ou para registrar a estrutura de objetos de schema. Hot e Cold Backups são Backups físicos que copiam arquivos de dados reais, que podem ser usados diretamente pelo **mysqld** Server para um Restore mais rápido.

Usar o *MySQL Enterprise Backup* é o método recomendado para realizar o Backup de dados `InnoDB`.

Nota

O `InnoDB` não suporta Databases que são restaurados usando ferramentas de Backup de terceiros.

#### Hot Backups

O comando **mysqlbackup**, parte do componente MySQL Enterprise Backup, permite que você faça Backup de uma instância MySQL em execução, incluindo tabelas `InnoDB`, com interrupção mínima nas operações, enquanto produz um snapshot consistente do Database. Quando o **mysqlbackup** está copiando tabelas `InnoDB`, leituras e escritas nas tabelas `InnoDB` podem continuar. O MySQL Enterprise Backup também pode criar arquivos de Backup compactados e fazer Backup de subconjuntos de tabelas e Databases. Em conjunto com o Binary Log do MySQL, os usuários podem realizar a recuperação point-in-time. O MySQL Enterprise Backup faz parte da subscrição MySQL Enterprise. Para mais detalhes, consulte a Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.

#### Cold Backups

Se você puder desligar o MySQL Server, poderá fazer um Backup físico que consiste em todos os arquivos usados pelo `InnoDB` para gerenciar suas tabelas. Use o seguinte procedimento:

1. Realize um *slow shutdown* do MySQL Server e certifique-se de que ele pare sem erros.

2. Copie todos os arquivos de dados `InnoDB` (arquivos `ibdata` e arquivos `.ibd`) para um local seguro.

3. Copie todos os arquivos `.frm` para tabelas `InnoDB` para um local seguro.

4. Copie todos os arquivos de Log `InnoDB` (arquivos `ib_logfile`) para um local seguro.

5. Copie seu(s) arquivo(s) de configuração `my.cnf` para um local seguro.

#### Logical Backups Using mysqldump

Além dos Backups físicos, é recomendado que você crie regularmente Backups lógicos despejando suas tabelas usando o **mysqldump**. Um arquivo binário pode estar corrompido sem que você perceba. Tabelas despejadas são armazenadas em arquivos de texto que são legíveis por humanos, tornando mais fácil detectar corrupção de tabela. Além disso, como o formato é mais simples, a chance de corrupção grave de dados é menor. O **mysqldump** também possui uma opção `--single-transaction` para criar um snapshot consistente sem aplicar Lock em outros clientes. Consulte a Seção 7.3.1, “Estabelecendo uma Política de Backup”.

A Replication funciona com tabelas `InnoDB`, então você pode usar os recursos de Replication do MySQL para manter uma cópia do seu Database em locais que exigem alta disponibilidade. Consulte a Seção 14.20, “InnoDB e MySQL Replication”.