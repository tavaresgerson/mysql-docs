#### 8.5.2.1 Instalação do Componente de Máscara de Dados do MySQL Enterprise

Os componentes oferecem acesso expandido à funcionalidade de Máscara de Dados do MySQL Enterprise. Anteriormente, o MySQL implementou as capacidades de mascaramento e desidentificação como um arquivo de biblioteca de plugins contendo um plugin e várias funções carregáveis. Antes de começar a instalação do componente, remova o plugin `data_masking` e todas as suas funções carregáveis para evitar conflitos. Para obter instruções, consulte a Seção 8.5.3.1, “Instalação do Plugin de Máscara de Dados do MySQL Enterprise”.

As tabelas e componentes do MySQL Enterprise Data Masking são:

* Tabela `masking_dictionaries`

  Objetivo: Uma tabela que fornece armazenamento persistente para dicionários e termos de mascaramento. Embora o esquema de sistema `mysql` seja a opção de armazenamento tradicional, a criação de um esquema dedicado para esse propósito também é permitida. Um esquema dedicado pode ser preferível por essas razões:

  + O esquema de sistema `mysql` não é respaldado por um backup lógico, como **mysqldump** ou operações de carregamento.

  + Um esquema dedicado facilita a replicação para fora.
  + Um usuário ou papel não requer privilégios de esquema `mysql` ao realizar tarefas relacionadas de mascaramento de dados no esquema dedicado.

* Componente `component_masking`

  Objetivo: O componente implementa o núcleo da funcionalidade de mascaramento e expõe-a como serviços.

  URN: `file://component_masking`

* Componente `component_masking_functions`

  Objetivo: O componente expõe toda a funcionalidade do componente `component_masking` como funções carregáveis. Algumas das funções requerem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.

  URN: `file://component_masking_functions`

Se os componentes e funções forem usados em um servidor de fonte de replicação, instale-os em todos os servidores replicados para evitar problemas de replicação. Enquanto os componentes estiverem carregados, as informações sobre eles estarão disponíveis conforme descrito na Seção 7.5.2, “Obtendo Informações sobre Componentes”. Para informações gerais sobre a instalação ou desinstalação de componentes, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

O MySQL Enterprise Data Masking suporta esses procedimentos de instalação e remoção:

* Instalar usando o esquema de sistema mysql
* Instalar usando um esquema dedicado
* Desinstalar componentes do MySQL Enterprise Data Masking

##### Instalar usando o esquema de sistema mysql

Observação

Considere usar um esquema dedicado para armazenar dicionários de mascaramento de dados (consulte Instalar usando um esquema dedicado).

Para configurar o MySQL Enterprise Data Masking:

1. Execute `masking_functions_install.sql` para adicionar a tabela `masking_dictionaries` ao esquema `mysql` e instalar os componentes. O script está localizado no diretório `share` da sua instalação do MySQL.

   ```
   $> mysql -u root -p -D mysql < [path/]masking_functions_install.sql
   Enter password: (enter root password here)
   ```

##### Instalar usando um esquema dedicado

Para configurar o MySQL Enterprise Data Masking:

1. Crie um banco de dados para armazenar a tabela `masking_dictionaries`. Por exemplo, para usar `mask_db` como o nome do banco de dados, execute esta instrução:

   ```
   $> mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mask_db"
   Enter password: (enter root password here)
   ```

2. Execute `masking_functions_install.sql` para adicionar a tabela `masking_dictionaries` ao esquema `mask_db` e instalar os componentes. O script está localizado no diretório `share` da sua instalação do MySQL.

   ```
   $> mysql -u root -p -D mask_db < [path/]masking_functions_install.sql
   Enter password: (enter root password here)
   ```

3. Defina e persista o esquema `mask_db` no início da inicialização, precedendo o nome da variável `component_masking.masking_database` com a palavra-chave `PERSIST_ONLY`.

   ```
   $> mysql -u root -p -e "SET PERSIST_ONLY component_masking.masking_database=mask_db"
   Enter password: (enter root password here)
   ```

   Após modificar a variável, reinicie o servidor para fazer com que o novo ajuste entre em vigor.

##### Desinstale os Componentes de Máscara de Dados do MySQL Enterprise

Para remover a Máscara de Dados do MySQL Enterprise ao usar o esquema de sistema `mysql`:

1. Execute `masking_functions_uninstall.sql` para remover a tabela `masking_dictionaries` do esquema apropriado e desinstalar os componentes. O script está localizado no diretório `share` da sua instalação do MySQL. O exemplo aqui especifica o banco de dados `mysql`.

   ```
   $> mysql -u root -p -D mysql < [path/]masking_functions_uninstall.sql
   Enter password: (enter root password here)
   ```

Para remover a Máscara de Dados do MySQL Enterprise ao usar um esquema dedicado:

1. Execute `masking_functions_uninstall.sql` para remover a tabela `masking_dictionaries` do esquema apropriado e desinstalar os componentes. O script está localizado no diretório `share` da sua instalação do MySQL. O exemplo aqui especifica o banco de dados `mask_db`.

   ```
   $> mysql -u root -p -D mask_db < [path/]masking_functions_uninstall.sql
   Enter password: (enter root password here)
   ```

2. Pare de persistir a variável `component_masking.masking_database`.

   ```
   $> mysql -u root -p -e "RESET PERSIST component_masking.masking_database"
   Enter password: (enter root password here)
   ```

3. [Opcional] Descarte o esquema dedicado para garantir que ele não seja usado para outros propósitos.

   ```
   DROP DATABASE mask_db;
   ```