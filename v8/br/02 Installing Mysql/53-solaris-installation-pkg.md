### 2.7.1 Instalando o MySQL no Solaris usando um PKG Solaris

Você pode instalar o MySQL no Solaris usando um pacote binário no formato nativo do PKG Solaris, em vez da distribuição de tarball binário.

Para usar este pacote, baixe o arquivo correspondente `mysql-VERSION-solaris11-PLATFORM.pkg.gz`, em seguida, descomprima-o. Por exemplo:

```
$> gunzip mysql-8.4.6-solaris11-x86_64.pkg.gz
```

Para instalar um novo pacote, use `pkgadd` e siga as instruções na tela. Você deve ter privilégios de root para realizar essa operação:

```
$> pkgadd -d mysql-8.4.6-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 8.4.6

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

O instalador PKG instala todos os arquivos e ferramentas necessários e, em seguida, inicializa sua base de dados, se não existir. Para completar a instalação, você deve definir a senha de root para o MySQL conforme fornecido nas instruções no final da instalação. Alternativamente, você pode executar o script `mysql_secure_installation` que vem com a instalação.

Por padrão, o pacote PKG instala o MySQL no caminho raiz `/opt/mysql`. Você pode alterar apenas o caminho de raiz de instalação ao usar `pkgadd`, o que pode ser usado para instalar o MySQL em uma zona Solaris diferente. Se você precisar instalar em um diretório específico, use uma distribuição de arquivo `tar` binário.

O instalador `pkg` copia um script de inicialização adequado para o MySQL para `/etc/init.d/mysql`. Para habilitar o MySQL a inicializar e desligar automaticamente, você deve criar um link entre este arquivo e os diretórios de script de inicialização. Por exemplo, para garantir o início e o desligamento seguros do MySQL, você poderia usar os seguintes comandos para adicionar os links corretos:

```
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

Para remover o MySQL, o nome do pacote instalado é `mysql`. Você pode usar isso em combinação com o comando `pkgrm` para remover a instalação.

Para fazer uma atualização ao usar o formato de arquivo de pacote Solaris, você deve remover a instalação existente antes de instalar o pacote atualizado. A remoção do pacote não exclui as informações da base de dados existente, apenas o servidor, os binários e os arquivos de suporte. A sequência típica de atualização é, portanto:

```
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-8.4.6-solaris11-x86_64.pkg
$> mysqld_safe &
```

Você deve verificar as notas no Capítulo 3, *Atualizando o MySQL*, antes de realizar qualquer atualização.