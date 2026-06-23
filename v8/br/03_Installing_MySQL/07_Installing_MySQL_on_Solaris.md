## 2.7 Instalar o MySQL no Solaris

Nota

MySQL 8.0 suporta Solaris 11.4 e versões posteriores

O MySQL no Solaris está disponível em vários formatos diferentes.

* Para informações sobre a instalação usando o formato nativo Solaris PKG, consulte a Seção 2.7.1, “Instalando o MySQL no Solaris usando um Solaris PKG”.

* Para usar uma instalação binária padrão do `tar`, use as notas fornecidas na Seção 2.2, "Instalando MySQL em Unix/Linux usando binários genéricos". Verifique as notas e dicas no final desta seção para notas específicas do Solaris que você pode precisar antes ou depois da instalação.

Nota

O MySQL 5.7 tem uma dependência nas Bibliotecas de Rotinas do Oracle Developer Studio; mas isso não se aplica ao MySQL 8.0.

Para obter uma distribuição binária do MySQL para Solaris em formato tarball ou PKG, <https://dev.mysql.com/downloads/mysql/8.0.html>.

Observações adicionais a serem consideradas ao instalar e usar o MySQL no Solaris:

* Se você deseja usar o MySQL com o usuário e grupo `mysql`, use os comandos **groupadd** e **useradd**:

  ```
  groupadd mysql
  useradd -g mysql -s /bin/false mysql
  ```

* Se você instalar o MySQL usando uma distribuição binária em tarball no Solaris, porque o **tar** do Solaris não pode lidar com nomes de arquivos longos, use o **GNU tar** (**gtar**) para descompactuar a distribuição. Se você não tem o **GNU tar** em seu sistema, instale-o com o seguinte comando:

  ```
  pkg install archiver/gnu-tar
  ```

* Você deve montar qualquer sistema de arquivos no qual você pretende armazenar arquivos `InnoDB` com a opção `forcedirectio`. (Por padrão, o montagem é feito sem essa opção.) Não fazer isso causa uma queda significativa no desempenho ao usar o motor de armazenamento `InnoDB` nesta plataforma.

* Se você deseja que o MySQL comece automaticamente, pode copiar `support-files/mysql.server` para `/etc/init.d` e criar um link simbólico para ele com o nome `/etc/rc3.d/S99mysql.server`.

* Se muitos processos tentarem se conectar muito rapidamente ao **mysqld**, você deve ver esse erro no log do MySQL:

  ```
  Error in accept: Protocol error
  ```

Você pode tentar iniciar o servidor com a opção `--back_log=50` como uma solução provisória para isso.

* Para configurar a geração de arquivos de núcleo no Solaris, você deve usar o comando **coreadm**. Devido às implicações de segurança da geração de um núcleo em um aplicativo `setuid()`, por padrão, o Solaris não suporta arquivos de núcleo em programas `setuid()`. No entanto, você pode modificar esse comportamento usando **coreadm**. Se você habilitar os arquivos de núcleo `setuid()` para o usuário atual, eles são gerados usando o modo 600 e são de propriedade do superusuário.

### 2.7.1 Instalar o MySQL no Solaris usando um PKG Solaris

Você pode instalar o MySQL no Solaris usando um pacote binário do formato nativo Solaris PKG, em vez da distribuição de tarball binário.

Nota

O MySQL 5.7 tem uma dependência nas Bibliotecas de Rotinas do Oracle Developer Studio; mas isso não se aplica ao MySQL 8.0.

Para usar este pacote, faça o download do arquivo correspondente `mysql-VERSION-solaris11-PLATFORM.pkg.gz`, em seguida, descompacte-o. Por exemplo:

```
$> gunzip mysql-8.0.44-solaris11-x86_64.pkg.gz
```

Para instalar um novo pacote, use **pkgadd** e siga as instruções na tela. Você deve ter privilégios de root para realizar essa operação:

```
$> pkgadd -d mysql-8.0.44-solaris11-x86_64.pkg

The following packages are available:
  1  mysql     MySQL Community Server (GPL)
               (i86pc) 8.0.44

Select package(s) you wish to process (or 'all' to process
all packages). (default: all) [?,??,q]:
```

O instalador do PKG instala todos os arquivos e as ferramentas necessárias e, em seguida, inicializa o seu banco de dados, se este não existir. Para completar a instalação, você deve definir a senha do root para o MySQL conforme fornecido nas instruções no final da instalação. Alternativamente, você pode executar o script **mysql_secure_installation** que vem com a instalação.

Por padrão, o pacote PKG instala o MySQL no caminho raiz `/opt/mysql`. Você pode alterar apenas o caminho de instalação raiz ao usar o **pkgadd**, que pode ser usado para instalar o MySQL em uma zona diferente do Solaris. Se você precisar instalar em um diretório específico, use uma distribuição de arquivo binário **tar**.

O instalador `pkg` copia um script de inicialização adequado para o MySQL no `/etc/init.d/mysql`. Para permitir que o MySQL seja iniciado e desligado automaticamente, você deve criar um link entre este arquivo e os diretórios do script de inicialização. Por exemplo, para garantir o início e o desligamento seguros do MySQL, você pode usar os seguintes comandos para adicionar os links corretos:

```
$> ln /etc/init.d/mysql /etc/rc3.d/S91mysql
$> ln /etc/init.d/mysql /etc/rc0.d/K02mysql
```

Para remover o MySQL, o nome do pacote instalado é `mysql`. Você pode usar isso em combinação com o comando **pkgrm** para remover a instalação.

Para fazer uma atualização ao usar o formato de arquivo de pacote Solaris, você deve remover a instalação existente antes de instalar o pacote atualizado. A remoção do pacote não exclui as informações de banco de dados existentes, apenas o servidor, os binários e os arquivos de suporte. A sequência típica de atualização, portanto, é:

```
$> mysqladmin shutdown
$> pkgrm mysql
$> pkgadd -d mysql-8.0.44-solaris11-x86_64.pkg
$> mysqld_safe &
$> mysql_upgrade   # prior to MySQL 8.0.16 only
```

Você deve verificar as notas do Capítulo 3, *Atualizando o MySQL*, antes de realizar qualquer atualização.