### 2.7.1 Instalando MySQL no Solaris Usando um PKG do Solaris

Você pode instalar o MySQL no Solaris usando um pacote `binary` no formato nativo PKG do Solaris, em vez da distribuição `binary tarball`.

Importante

O pacote de instalação tem uma `dependency` nas `Runtime Libraries` do Oracle Developer Studio 12.5, que devem ser instaladas antes de executar o pacote de instalação do MySQL. Veja as opções de `download` para o Oracle Developer Studio [aqui]. O pacote de instalação permite que você instale apenas as `runtime libraries`, em vez do Oracle Developer Studio completo; consulte as instruções em [Instalando Apenas as Runtime Libraries no Oracle Solaris 11](https://docs.oracle.com/cd/E60778_01/html/E60743/gozsu.html).

Para usar este pacote, baixe o arquivo correspondente `mysql-VERSION-solaris11-PLATFORM.pkg.gz` e, em seguida, descompacte-o. Por exemplo:

```sql
$> gunzip mysql-5.7.44-solaris11-x86_64.pkg.gz
```

Para instalar um novo pacote, use **pkgadd** e siga os `prompts` na tela. Você deve ter privilégios de `root` para executar esta operação:

```sql
$> pkgadd -d mysql-5.7.44-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 5.7.44

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

O `installer` PKG instala todos os arquivos e `tools` necessários e, em seguida, inicializa seu `database` se um não existir. Para completar a instalação, você deve definir a senha do `root` para o MySQL conforme fornecido nas instruções no final da instalação. Alternativamente, você pode executar o `script` **mysql_secure_installation** que acompanha a instalação.

Por padrão, o pacote PKG instala o MySQL sob o `root path` `/opt/mysql`. Você pode alterar apenas o `root path` de instalação ao usar **pkgadd**, que pode ser usado para instalar o MySQL em uma `zone` diferente do Solaris. Se você precisar instalar em um diretório específico, use uma distribuição de arquivo **tar** `binary`.

O `installer` `pkg` copia um `script` de `startup` adequado para o MySQL em `/etc/init.d/mysql`. Para permitir que o MySQL inicie (`startup`) e desligue (`shutdown`) automaticamente, você deve criar um `link` entre este arquivo e os diretórios do `init script`. Por exemplo, para garantir o `startup` e `shutdown` seguros do MySQL, você pode usar os seguintes comandos para adicionar os `links` corretos:

```sql
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

Para remover o MySQL, o nome do pacote instalado é `mysql`. Você pode usar isso em combinação com o comando **pkgrm** para remover a instalação.

Para fazer o `upgrade` ao usar o formato de arquivo de pacote do Solaris, você deve remover a instalação existente antes de instalar o pacote atualizado. A remoção do pacote não exclui as informações do `database` existente, apenas o `server`, `binaries` e arquivos de suporte. A sequência de `upgrade` típica é, portanto:

```sql
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-5.7.44-solaris11-x86_64.pkg
$> mysqld_safe &
$> mysql_upgrade
```

Você deve verificar as notas na Seção 2.10, “Upgrading MySQL” antes de realizar qualquer `upgrade`.