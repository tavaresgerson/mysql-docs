### 22.4.2 Baixar e importar o banco de dados world_x

Como parte deste guia rápido, é fornecido um esquema de exemplo, referido como o esquema `world_x`. Muitos dos exemplos demonstram a funcionalidade do Armazenamento de Documentos usando este esquema. Inicie o servidor MySQL para que você possa carregar o esquema `world_x`, depois siga estes passos:

1. Baixe world_x-db.zip.

2. Extraia o arquivo de instalação para um local temporário, como `/tmp/`. A descompactação do arquivo resulta em um único arquivo chamado `world_x.sql`.

3. Importe o arquivo `world_x.sql` no seu servidor. Você pode:

   * Iniciar o MySQL Shell no modo SQL e importar o arquivo digitando:

     ```
     mysqlsh -u root --sql --file /tmp/world_x-db/world_x.sql
     Enter password: ****
     ```

   * Definir o MySQL Shell no modo SQL enquanto ele estiver em execução e importar o arquivo de esquema digitando:

     ```
     \sql
     Switching to SQL mode... Commands end with ;
     \source /tmp/world_x-db/world_x.sql
     ```

   Substitua `/tmp/` pelo caminho do arquivo `world_x.sql` no seu sistema. Insira sua senha se solicitado. Uma conta não root pode ser usada, desde que a conta tenha privilégios para criar novos esquemas.

#### O Esquema world_x

O esquema de exemplo `world_x` contém a seguinte coleção JSON e tabelas relacionais:

* Coleção

  + `countryinfo`: Informações sobre países do mundo.

* Tabelas

  + `country`: Informações mínimas sobre países do mundo.

  + `city`: Informações sobre algumas das cidades desses países.

  + `countrylanguage`: Idiomas falados em cada país.

#### Informações Relacionadas

* Sessões do MySQL Shell explica os tipos de sessão.