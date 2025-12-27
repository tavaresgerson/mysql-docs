## 2.7 Instalando o MySQL no Solaris

::: info Nota

O MySQL 8.4 suporta o Solaris 11.4 e versões posteriores

:::

O MySQL no Solaris está disponível em vários formatos diferentes.

* Para obter informações sobre a instalação usando o formato nativo de PKG do Solaris.
* Para usar uma instalação padrão com o binário `tar`, use as notas fornecidas na Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”. Verifique as notas e dicas no final desta seção para notas específicas do Solaris que você pode precisar antes ou depois da instalação.

Para obter uma distribuição binária do MySQL para Solaris em formato tarball ou PKG, <https://dev.mysql.com/downloads/mysql/8.4.html>.

Observações adicionais a serem consideradas ao instalar e usar o MySQL no Solaris:

* Se você deseja usar o MySQL com o usuário e grupo `mysql`, use os comandos `groupadd` e `useradd`:

  ```
  groupadd mysql
  useradd -g mysql -s /bin/false mysql
  ```
* Se você instalar o MySQL usando uma distribuição binária tarball no Solaris, porque o `tar` do Solaris não pode lidar com nomes de arquivos longos, use o `GNU tar` (`gtar`) para descompactar a distribuição. Se você não tiver o `GNU tar` no seu sistema, instale-o com o seguinte comando:

  ```
  pkg install archiver/gnu-tar
  ```
* Você deve montar quaisquer sistemas de arquivos nos quais pretende armazenar os arquivos `InnoDB` com a opção `forcedirectio`. (Por padrão, a montagem é feita sem essa opção.) Falhar nisso causa uma queda significativa no desempenho ao usar o motor de armazenamento `InnoDB` nesta plataforma.
* Se você deseja que o MySQL seja iniciado automaticamente, pode copiar `support-files/mysql.server` para `/etc/init.d` e criar um link simbólico para ele chamado `/etc/rc3.d/S99mysql.server`.
* Se muitos processos tentarem se conectar muito rapidamente ao `mysqld`, você deve ver esse erro no log do MySQL:

  ```
  Error in accept: Protocol error
  ```

Você pode tentar iniciar o servidor com a opção `--back_log=50` como uma solução temporária para isso.
* Para configurar a geração de arquivos de núcleo no Solaris, você deve usar o comando `coreadm`. Devido às implicações de segurança da geração de um núcleo em um aplicativo `setuid()`, o Solaris, por padrão, não suporta arquivos de núcleo em programas `setuid()`. No entanto, você pode modificar esse comportamento usando `coreadm`. Se você habilitar arquivos de núcleo `setuid()` para o usuário atual, eles são gerados com o modo 600 e são de propriedade do superusuário.