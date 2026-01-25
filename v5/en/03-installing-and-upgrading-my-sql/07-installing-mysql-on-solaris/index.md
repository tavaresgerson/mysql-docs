## 2.7 Instalação do MySQL no Solaris

2.7.1 Instalação do MySQL no Solaris Usando um PKG do Solaris

Nota

O MySQL 5.7 suporta o Solaris 11 (Update 3 e posterior).

O MySQL para Solaris está disponível em vários formatos diferentes.

* Para informações sobre a instalação usando o formato nativo PKG do Solaris, consulte a Seção 2.7.1, “Instalação do MySQL no Solaris Usando um PKG do Solaris”.

* Para usar uma instalação binária `tar` padrão, utilize as notas fornecidas na Seção 2.2, “Instalação do MySQL no Unix/Linux Usando Binários Genéricos”. Verifique as notas e dicas no final desta seção para observações específicas do Solaris que você possa precisar antes ou depois da instalação.

Importante

Os pacotes de instalação têm uma dependência das Bibliotecas de Runtime (Runtime Libraries) do Oracle Developer Studio 12.5, que devem ser instaladas antes de executar o pacote de instalação do MySQL. Consulte as opções de download para o Oracle Developer Studio aqui. O pacote de instalação permite que você instale apenas as bibliotecas de runtime, em vez do Oracle Developer Studio completo; consulte as instruções em [Installing Only the Runtime Libraries on Oracle Solaris 11](https://docs.oracle.com/cd/E60778_01/html/E60743/gozsu.html).

Para obter uma distribuição binária do MySQL para Solaris nos formatos tarball ou PKG, acesse <https://dev.mysql.com/downloads/mysql/5.7.html>.

Observações adicionais a serem consideradas ao instalar e usar o MySQL no Solaris:

* Se você quiser usar o MySQL com o user e group `mysql`, use os comandos **groupadd** e **useradd**:

  ```sql
  groupadd mysql
  useradd -g mysql -s /bin/false mysql
  ```

* Se você instalar o MySQL usando uma distribuição binária tarball no Solaris, como o **tar** do Solaris não consegue lidar com nomes de arquivos longos, use o GNU **tar** (**gtar**) para desempacotar a distribuição. Se você não tiver o GNU **tar** em seu sistema, instale-o com o seguinte comando:

  ```sql
  pkg install archiver/gnu-tar
  ```

* Você deve montar quaisquer file systems nos quais pretenda armazenar arquivos `InnoDB` com a opção `forcedirectio`. (Por padrão, a montagem é feita sem esta opção.) Não fazer isso causa uma queda significativa no performance ao usar o storage engine `InnoDB` nesta plataforma.

* Se você quiser que o MySQL inicie automaticamente, você pode copiar `support-files/mysql.server` para `/etc/init.d` e criar um symbolic link para ele chamado `/etc/rc3.d/S99mysql.server`.

* Se muitos processes tentarem se conectar muito rapidamente ao **mysqld**, você deverá ver este erro no log do MySQL:

  ```sql
  Error in accept: Protocol error
  ```

  Você pode tentar iniciar o server com a opção `--back_log=50` como uma solução alternativa (workaround) para isso.

* Para configurar a geração de core files no Solaris, você deve usar o comando **coreadm**. Devido às implicações de segurança da geração de um core em uma aplicação `setuid()`, por padrão, o Solaris não suporta core files em programas `setuid()`. No entanto, você pode modificar esse comportamento usando **coreadm**. Se você habilitar core files `setuid()` para o user atual, eles serão gerados usando o mode 600 e pertencerão ao superuser.