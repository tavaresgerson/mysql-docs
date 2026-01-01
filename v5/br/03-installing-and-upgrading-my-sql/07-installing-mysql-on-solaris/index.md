## 2.7 Instalando o MySQL no Solaris

2.7.1 Instalação do MySQL no Solaris usando um PKG Solaris

Nota

O MySQL 5.7 suporta o Solaris 11 (Atualização 3 e versões posteriores).

O MySQL no Solaris está disponível em vários formatos diferentes.

- Para obter informações sobre a instalação usando o formato nativo de PKG do Solaris, consulte a Seção 2.7.1, “Instalando o MySQL no Solaris usando um PKG do Solaris”.

- Para usar uma instalação padrão do binário `tar`, use as notas fornecidas na Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”. Verifique as notas e dicas no final desta seção para notas específicas do Solaris que você pode precisar antes ou depois da instalação.

Importante

Os pacotes de instalação têm dependência das Bibliotecas de Tempo de Execução do Oracle Developer Studio 12.5, que devem ser instaladas antes de executar o pacote de instalação do MySQL. Veja as opções de download do Oracle Developer Studio aqui. O pacote de instalação permite que você instale apenas as bibliotecas de tempo de execução, em vez do Oracle Developer Studio completo; consulte as instruções em [Instalando apenas as Bibliotecas de Tempo de Execução no Oracle Solaris 11](https://docs.oracle.com/cd/E60778_01/html/E60743/gozsu.html).

Para obter uma distribuição binária do MySQL para Solaris no formato tarball ou PKG, acesse <https://dev.mysql.com/downloads/mysql/5.7.html>.

Observações adicionais a serem consideradas ao instalar e usar o MySQL no Solaris:

- Se você quiser usar o MySQL com o usuário e grupo `mysql`, use os comandos **groupadd** e **useradd**:

  ```sql
  groupadd mysql
  useradd -g mysql -s /bin/false mysql
  ```

- Se você instalar o MySQL usando uma distribuição binária em tarball no Solaris, porque o **tar** do Solaris não consegue lidar com nomes de arquivos longos, use o **tar** do GNU (**gtar**) para descompactar a distribuição. Se você não tiver o **tar** do GNU no seu sistema, instale-o com o seguinte comando:

  ```sql
  pkg install archiver/gnu-tar
  ```

- Você deve montar qualquer sistema de arquivos no qual pretende armazenar arquivos do `InnoDB` com a opção `forcedirectio`. (Por padrão, o montagem é feita sem essa opção.) Não fazer isso causa uma queda significativa no desempenho ao usar o mecanismo de armazenamento `InnoDB` nesta plataforma.

- Se você deseja que o MySQL seja iniciado automaticamente, pode copiar `support-files/mysql.server` para `/etc/init.d` e criar um link simbólico para ele chamado `/etc/rc3.d/S99mysql.server`.

- Se muitos processos tentarem se conectar muito rapidamente ao **mysqld**, você deve ver esse erro no log do MySQL:

  ```sql
  Error in accept: Protocol error
  ```

  Você pode tentar iniciar o servidor com a opção `--back_log=50` como uma solução temporária para isso.

- Para configurar a geração de arquivos de núcleo no Solaris, você deve usar o comando **coreadm**. Devido às implicações de segurança da geração de um núcleo em um aplicativo `setuid()`, por padrão, o Solaris não suporta arquivos de núcleo em programas `setuid()`. No entanto, você pode modificar esse comportamento usando **coreadm**. Se você habilitar arquivos de núcleo `setuid()` para o usuário atual, eles são gerados com o modo 600 e são de propriedade do superusuário.
