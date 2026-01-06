### 14.19.1 Backup do InnoDB

A chave para a gestão segura de bancos de dados é fazer backups regulares. Dependendo do volume de dados, do número de servidores MySQL e da carga de trabalho do banco de dados, você pode usar essas técnicas de backup, isoladamente ou em combinação: backup quente com o MySQL Enterprise Backup; backup frio copiando arquivos enquanto o servidor MySQL está desligado; backup lógico com **mysqldump** para volumes de dados menores ou para registrar a estrutura dos objetos do esquema. Os backups quentes e frios são backups físicos que copiam os arquivos de dados reais, que podem ser usados diretamente pelo servidor **mysqld** para uma restauração mais rápida.

Usar o *MySQL Enterprise Backup* é o método recomendado para fazer backup dos dados do `InnoDB`.

Nota

O `InnoDB` não suporta bancos de dados restaurados usando ferramentas de backup de terceiros.

#### Backup Quente

O comando **mysqlbackup**, parte do componente MySQL Enterprise Backup, permite fazer backup de uma instância do MySQL em execução, incluindo as tabelas `InnoDB`, com mínima interrupção das operações e a produção de um instantâneo consistente do banco de dados. Quando o **mysqlbackup** está copiando as tabelas `InnoDB`, as leituras e escritas nessas tabelas podem continuar. O MySQL Enterprise Backup também pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas e bancos de dados. Em conjunto com o log binário do MySQL, os usuários podem realizar a recuperação em um ponto no tempo. O MySQL Enterprise Backup faz parte da assinatura do MySQL Enterprise. Para mais detalhes, consulte a Seção 28.1, “MySQL Enterprise Backup Overview”.

#### Backup em frio

Se você puder desligar o servidor MySQL, você pode fazer um backup físico que consiste em todos os arquivos usados pelo `InnoDB` para gerenciar suas tabelas. Use o procedimento a seguir:

1. Realize um desligamento lento do servidor MySQL e certifique-se de que ele pare sem erros.

2. Copie todos os arquivos de dados do InnoDB (`arquivos ibdata` e arquivos .ibd) para um local seguro.

3. Copie todos os arquivos `.frm` das tabelas do `InnoDB` para um local seguro.

4. Copie todos os arquivos de log do InnoDB (`ib_logfile` files) para um local seguro.

5. Copie seu arquivo de configuração `my.cnf` ou arquivos para um local seguro.

#### Backup lógico usando mysqldump

Além dos backups físicos, é recomendável que você crie regularmente backups lógicos, descarregando suas tabelas usando o **mysqldump**. Um arquivo binário pode ficar corrompido sem que você perceba. As tabelas descarregadas são armazenadas em arquivos de texto que são legíveis por humanos, tornando mais fácil identificar a corrupção da tabela. Além disso, como o formato é mais simples, a chance de corrupção de dados graves é menor. O **mysqldump** também tem a opção `--single-transaction` para fazer um instantâneo consistente sem bloquear outros clientes. Veja a Seção 7.3.1, “Estabelecendo uma Política de Backup”.

A replicação funciona com tabelas `InnoDB`, então você pode usar as capacidades de replicação do MySQL para manter uma cópia do seu banco de dados em locais do banco de dados que exigem alta disponibilidade. Veja a Seção 14.20, “InnoDB e replicação do MySQL”.
