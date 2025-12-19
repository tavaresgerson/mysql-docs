## 2.7 Instalação do MySQL no Solaris

::: info Note

MySQL 8.4 suporta Solaris 11.4 e superior

:::

O MySQL no Solaris está disponível em vários formatos diferentes.

- Para obter informações sobre a instalação usando o formato nativo Solaris PKG, consulte a Seção 2.7.1, Instalar MySQL no Solaris Usando um Solaris PKG.
- Para usar uma instalação binária padrão do `tar`, use as notas fornecidas na Seção 2.2, Instalar o MySQL no Unix/Linux Usando Binários Genéricos. Verifique as notas e dicas no final desta seção para notas específicas do Solaris que você pode precisar antes ou depois da instalação.

Para obter uma distribuição binária do MySQL para o Solaris em formato tarball ou PKG, <https://dev.mysql.com/downloads/mysql/8.4.html>.

Notas adicionais a serem conhecidas ao instalar e usar o MySQL no Solaris:

- Se você quiser usar o MySQL com o usuário e o grupo `mysql`, use os comandos **groupadd** e **useradd**:

  ```
  groupadd mysql
  useradd -g mysql -s /bin/false mysql
  ```
- Se você instalar o MySQL usando uma distribuição binária de tarball no Solaris, porque o Solaris **tar** não pode lidar com nomes de arquivo longos, use o GNU **tar** (**gtar**) para descompactar a distribuição. Se você não tiver o GNU **tar** em seu sistema, instale-o com o seguinte comando:

  ```
  pkg install archiver/gnu-tar
  ```
- Você deve montar todos os sistemas de arquivos em que pretende armazenar arquivos `InnoDB` com a opção `forcedirectio`. (Por padrão, a montagem é feita sem essa opção.) Não fazê-lo causa uma queda significativa no desempenho ao usar o mecanismo de armazenamento `InnoDB` nesta plataforma.
- Se você quiser que o MySQL inicie automaticamente, você pode copiar `support-files/mysql.server` para `/etc/init.d` e criar um link simbólico para ele chamado `/etc/rc3.d/S99mysql.server`.
- Se muitos processos tentam se conectar muito rapidamente ao **mysqld**, você deve ver este erro no log do MySQL:

  ```
  Error in accept: Protocol error
  ```

  Você pode tentar iniciar o servidor com a opção `--back_log=50` como uma solução para isso.
- Para configurar a geração de arquivos de núcleo no Solaris, você deve usar o comando **coreadm**. Devido às implicações de segurança de gerar um núcleo em um aplicativo `setuid()`, por padrão, o Solaris não suporta arquivos de núcleo em programas `setuid()`. No entanto, você pode modificar esse comportamento usando **coreadm**. Se você ativar os arquivos de núcleo `setuid()` para o usuário atual, eles são gerados usando o modo 600 e são de propriedade do superusuário.
