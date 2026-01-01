### 2.7.1 Instalar o MySQL no Solaris usando um PKG do Solaris

Você pode instalar o MySQL no Solaris usando um pacote binário no formato nativo do Solaris PKG, em vez da distribuição de tarball binário.

Importante

O pacote de instalação depende das Bibliotecas de Tempo de Execução do Oracle Developer Studio 12.5, que devem ser instaladas antes de executar o pacote de instalação do MySQL. Consulte as opções de download do Oracle Developer Studio aqui. O pacote de instalação permite que você instale as bibliotecas de tempo de execução apenas, em vez do Oracle Developer Studio completo; consulte as instruções em [Instalando apenas as Bibliotecas de Tempo de Execução no Oracle Solaris 11](https://docs.oracle.com/cd/E60778_01/html/E60743/gozsu.html).

Para usar este pacote, baixe o arquivo correspondente `mysql-VERSION-solaris11-PLATFORM.pkg.gz`, em seguida, descomprima-o. Por exemplo:

```sql
$> gunzip mysql-5.7.44-solaris11-x86_64.pkg.gz
```

Para instalar um novo pacote, use **pkgadd** e siga as instruções na tela. Você deve ter privilégios de root para realizar essa operação:

```sql
$> pkgadd -d mysql-5.7.44-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 5.7.44

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

O instalador PKG instala todos os arquivos e ferramentas necessários e, em seguida, inicializa o banco de dados, se este não existir. Para concluir a instalação, você deve definir a senha do root para o MySQL conforme fornecido nas instruções no final da instalação. Alternativamente, você pode executar o script **mysql\_secure\_installation** que vem com a instalação.

Por padrão, o pacote PKG instala o MySQL no caminho raiz `/opt/mysql`. Você pode alterar apenas o caminho de raiz de instalação ao usar o **pkgadd**, que pode ser usado para instalar o MySQL em uma zona diferente do Solaris. Se você precisar instalar em um diretório específico, use uma distribuição de arquivo **tar** binário.

O instalador `pkg` copia um script de inicialização adequado para o MySQL no `/etc/init.d/mysql`. Para permitir que o MySQL seja iniciado e desligado automaticamente, você deve criar um link entre este arquivo e os diretórios de scripts de inicialização. Por exemplo, para garantir o início e o desligamento seguros do MySQL, você pode usar os seguintes comandos para adicionar os links corretos:

```sql
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

Para remover o MySQL, o nome do pacote instalado é `mysql`. Você pode usar isso em combinação com o comando **pkgrm** para remover a instalação.

Para fazer uma atualização ao usar o formato de arquivo de pacote Solaris, você deve remover a instalação existente antes de instalar o pacote atualizado. A remoção do pacote não exclui as informações do banco de dados existentes, apenas o servidor, os binários e os arquivos de suporte. A sequência típica de atualização é, portanto:

```sql
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-5.7.44-solaris11-x86_64.pkg
$> mysqld_safe &
$> mysql_upgrade
```

Você deve verificar as notas na Seção 2.10, “Atualização do MySQL”, antes de realizar qualquer atualização.
