### 2.7.1 Instalar MySQL no Solaris usando um Solaris PKG

Você pode instalar o MySQL no Solaris usando um pacote binário do formato PKG nativo do Solaris em vez da distribuição binária de tarball.

Para usar este pacote, baixe o arquivo correspondente `mysql-VERSION-solaris11-PLATFORM.pkg.gz` e descomprime-o. Por exemplo:

```
$> gunzip mysql-8.4.6-solaris11-x86_64.pkg.gz
```

Para instalar um novo pacote, use `pkgadd` e siga as instruções na tela. Você deve ter privilégios de root para executar esta operação:

```
$> pkgadd -d mysql-8.4.6-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 8.4.6

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

O instalador PKG instala todos os arquivos e ferramentas necessárias e, em seguida, inicializa o seu banco de dados, se não existir um. Para concluir a instalação, você deve definir a senha raiz para o MySQL, conforme fornecido nas instruções no final da instalação. Alternativamente, você pode executar o script \*\* mysql\_secure\_installation \*\* que vem com a instalação.

Por padrão, o pacote PKG instala o MySQL sob o caminho raiz `/opt/mysql`. Você pode alterar apenas o caminho raiz da instalação ao usar `pkgadd`, que pode ser usado para instalar o MySQL em uma zona Solaris diferente. Se você precisar instalar em um diretório específico, use uma distribuição de arquivo binário `tar`.

O instalador `pkg` copia um script de inicialização adequado para o MySQL em `/etc/init.d/mysql`. Para habilitar o MySQL para inicialização e desligamento automático, você deve criar um link entre este arquivo e os diretórios de script de inicialização. Por exemplo, para garantir a inicialização e desligamento seguros do MySQL, você pode usar os seguintes comandos para adicionar os links certos:

```
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

Para remover o MySQL, o nome do pacote instalado é `mysql`. Você pode usar isso em combinação com o comando `pkgrm` para remover a instalação.

Para atualizar quando estiver usando o formato de arquivo do pacote Solaris, você deve remover a instalação existente antes de instalar o pacote atualizado. A remoção do pacote não elimina as informações do banco de dados existente, apenas o servidor, os binários e os arquivos de suporte. A sequência típica de atualização é, portanto:

```
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-8.4.6-solaris11-x86_64.pkg
$> mysqld_safe &
```

Você deve verificar as notas no Capítulo 3, \* Atualização do MySQL \* antes de executar qualquer atualização.
