### 22.3.2 Baixar e importar o banco de dados world\_x

Como parte deste guia rápido, um esquema de exemplo é fornecido, que é referido como o esquema `world_x`. Muitos dos exemplos demonstram a funcionalidade do Armazenamento de Documentos usando este esquema. Inicie o servidor MySQL para que você possa carregar o esquema `world_x`, então siga estes passos:

1. Faça o download do world\_x-db.zip.

2. Extraia o arquivo de instalação para um local temporário, como `/tmp/`. A descompactação do arquivo resulta em um único arquivo chamado `world_x.sql`.

3. Importe o arquivo `world_x.sql` para o seu servidor. Você pode:

   - Inicie o MySQL Shell no modo SQL e importe o arquivo emitindo:

     ```
     mysqlsh -u root --sql --file /tmp/world_x-db/world_x.sql
     Enter password: ****
     ```

   - Configure o MySQL Shell para o modo SQL enquanto ele estiver em execução e importe o arquivo do esquema executando:

     ```
     \sql
     Switching to SQL mode... Commands end with ;
     \source /tmp/world_x-db/world_x.sql
     ```

   Substitua `/tmp/` pelo caminho do arquivo `world_x.sql` no seu sistema. Digite sua senha, se solicitado. Uma conta que não seja de root pode ser usada, desde que a conta tenha privilégios para criar novos esquemas.

#### O esquema world\_x

O esquema de exemplo `world_x` contém a seguinte coleção JSON e tabelas relacionais:

- Coleção

  - `countryinfo`: Informações sobre países do mundo.

- Tabelas

  - `country`: Informações mínimas sobre os países do mundo.

  - `city`: Informações sobre algumas das cidades desses países.

  - `countrylanguage`: Línguas faladas em cada país.

#### Informações Relacionadas

- MySQL Shell Sessions explica os tipos de sessão.
