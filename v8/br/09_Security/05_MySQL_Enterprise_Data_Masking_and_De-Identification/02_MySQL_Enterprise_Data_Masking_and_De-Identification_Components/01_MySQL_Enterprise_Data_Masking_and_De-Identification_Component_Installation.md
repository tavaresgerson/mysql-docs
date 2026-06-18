#### 8.5.2.1 Instalação do componente de mascaramento e desidentificação de dados da MySQL Enterprise

A partir do MySQL 8.0.33, os componentes fornecem acesso à funcionalidade de Máscara de Dados e Desidentificação Empresarial do MySQL. Anteriormente, o MySQL implementou as capacidades de mascaramento e desidentificação como um arquivo de biblioteca de plugins contendo um plugin e várias funções carregáveis. Antes de começar a instalação do componente, remova o plugin `data_masking` e todas as suas funções carregáveis para evitar conflitos. Para obter instruções, consulte a Seção 8.5.3.1, “Instalação do Plugin de Máscara de Dados e Desidentificação Empresarial do MySQL”.

As tabelas e componentes de banco de dados para mascaramento e desidentificação de dados da MySQL Enterprise são:

- Tabela `masking_dictionaries`

  Propósito: Uma tabela no esquema do sistema `mysql` que fornece armazenamento persistente de dicionários e termos.

- Componente `component_masking`

  Objetivo: O componente implementa o núcleo da funcionalidade de mascaramento e expõe-o como serviços.

  URN: `file://component_masking`

- Componente `component_masking_functions`

  Objetivo: O componente expõe todas as funcionalidades do componente `component_masking` como funções carregáveis. Algumas das funções requerem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.

  URN: `file://component_masking_functions`

Para configurar o mascaramento e a desidentificação de dados do MySQL Enterprise, faça o seguinte:

1. Crie a tabela `masking_dictionaries`.

   ```
   CREATE TABLE IF NOT EXISTS
   mysql.masking_dictionaries(
       Dictionary VARCHAR(256) NOT NULL,
       Term VARCHAR(256) NOT NULL,
       UNIQUE INDEX dictionary_term_idx (Dictionary, Term),
       INDEX dictionary_idx (Dictionary)
   ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Use a instrução SQL `INSTALL COMPONENT` para instalar componentes de mascaramento de dados.

   ```
   INSTALL COMPONENT 'file://component_masking';
   INSTALL COMPONENT 'file://component_masking_functions';
   ```

   Se os componentes e funções forem usados em um servidor de origem de replicação, instale-os em todos os servidores replicados para evitar problemas de replicação. Enquanto os componentes estiverem carregados, as informações sobre eles estarão disponíveis conforme descrito na Seção 7.5.2, “Obtendo Informações sobre Componentes”.

Para remover o mascaramento de dados e a desidentificação do MySQL Enterprise, faça o seguinte:

1. Use a instrução SQL `UNINSTALL COMPONENT` para desinstalar os componentes de mascaramento de dados.

   ```
   UNINSTALL COMPONENT 'file://component_masking_functions';
   UNINSTALL COMPONENT 'file://component_masking';
   ```

2. Descarte a tabela `masking_dictionaries`.

   ```
   DROP TABLE mysql.masking_dictionaries;
   ```

`component_masking_functions` instala todas as funções carregáveis relacionadas automaticamente. Da mesma forma, quando o componente é desinstalado, ele também desinstala automaticamente essas funções. Para obter informações gerais sobre a instalação ou desinstalação de componentes, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.
