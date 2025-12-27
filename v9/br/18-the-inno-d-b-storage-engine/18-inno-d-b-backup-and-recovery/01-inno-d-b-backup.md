### 17.18.1 Backup do InnoDB

A chave para a gestão segura de bancos de dados é fazer backups regulares. Dependendo do volume de dados, do número de servidores MySQL e da carga de trabalho do banco de dados, você pode usar essas técnicas de backup, isoladamente ou em combinação: backup quente com o *MySQL Enterprise Backup*; backup frio copiando arquivos enquanto o servidor MySQL está desligado; backup lógico com **mysqldump** para volumes de dados menores ou para registrar a estrutura dos objetos do esquema. Os backups quentes e frios são backups físicos que copiam arquivos de dados reais, que podem ser usados diretamente pelo servidor **mysqld** para uma restauração mais rápida.

Usar o *MySQL Enterprise Backup* é o método recomendado para fazer backups de dados `InnoDB`.

Nota

`InnoDB` não suporta bancos de dados restaurados usando ferramentas de backup de terceiros.

#### Backups Quentes

O comando **mysqlbackup**, parte do componente MySQL Enterprise Backup, permite fazer backup de uma instância MySQL em execução, incluindo tabelas `InnoDB`, com mínima interrupção nas operações, enquanto produz um instantâneo consistente do banco de dados. Quando o **mysqlbackup** está copiando tabelas `InnoDB`, as leituras e escritas nas tabelas `InnoDB` podem continuar. O MySQL Enterprise Backup também pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas e bancos de dados. Em conjunto com o log binário do MySQL, os usuários podem realizar a recuperação em um ponto no tempo. O MySQL Enterprise Backup faz parte da assinatura do MySQL Enterprise. Para mais detalhes, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

#### Backups Frios

Se você puder desligar o servidor MySQL, pode fazer um backup físico que consiste em todos os arquivos usados pelo `InnoDB` para gerenciar suas tabelas. Use o seguinte procedimento:

1. Realize uma parada lenta do servidor MySQL e certifique-se de que ele pare sem erros.

2. Copie todos os arquivos de dados `InnoDB` (`arquivos `ibdata` e `.ibd`) para um local seguro.

3. Copie todos os arquivos de log de reverso `InnoDB` (`arquivos `#ib_redoN`) para um local seguro.

4. Copie seu arquivo de configuração `my.cnf` ou arquivos para um local seguro.

#### Backups Lógicos Usando mysqldump

Além dos backups físicos, é recomendável que você crie regularmente backups lógicos, descartando suas tabelas usando **mysqldump**. Um arquivo binário pode ser corrompido sem que você perceba. As tabelas descartadas são armazenadas em arquivos de texto que são legíveis por humanos, tornando mais fácil identificar a corrupção da tabela. Além disso, como o formato é mais simples, a chance de corrupção grave de dados é menor. O **mysqldump** também tem a opção `--single-transaction` para fazer um instantâneo consistente sem bloquear outros clientes. Veja a Seção 9.3.1, “Estabelecendo uma Política de Backup”.

A replicação funciona com tabelas `InnoDB`, então você pode usar as capacidades de replicação do MySQL para manter uma cópia de seu banco de dados em sites de banco de dados que requerem alta disponibilidade. Veja a Seção 17.19, “Replicação InnoDB e MySQL”.