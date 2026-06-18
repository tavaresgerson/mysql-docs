### 8.5.2 Componentes de Máscara e Desidentificação de Dados da MySQL Enterprise

8.5.2.1 Instalação do componente de mascaramento e desidentificação de dados do MySQL Enterprise

8.5.2.2 Uso dos componentes de mascaramento e desidentificação de dados da MySQL Enterprise

8.5.2.3 Referência de função do componente de mascaramento e desidentificação de dados do MySQL Enterprise

8.5.2.4 Descrições de função do componente de mascaramento e desidentificação de dados do MySQL Enterprise

O MySQL Enterprise Data Masking and De-Identification implementa esses elementos:

- Uma tabela no banco de dados do sistema `mysql` para armazenamento persistente de dicionários e termos.

- Um componente chamado `component_masking` que implementa a funcionalidade de mascaramento e a expõe como interface de serviço para os desenvolvedores.

  Os desenvolvedores que desejam incorporar as mesmas funções de serviço usadas pelo `component_masking` devem consultar o arquivo `internal\components\masking\component_masking.h` em uma distribuição de fonte MySQL ou <https://dev.mysql.com/doc/dev/mysql-server/latest>.

- Um componente chamado `component_masking_functions` que fornece funções carregáveis.

  O conjunto de funções carregáveis permite uma API em nível SQL para realizar operações de mascaramento e desidentificação. Algumas das funções exigem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.
