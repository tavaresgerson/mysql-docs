### 8.5.2 Componentes de Máscara e Desidentificação de Dados do MySQL Enterprise

O MySQL Enterprise Data Masking and De-Identification implementa esses elementos:

* Uma tabela para armazenamento persistente de dicionários e termos.
* Um componente chamado `component_masking` que implementa a funcionalidade de máscara e a expõe como interface de serviço para desenvolvedores.

Os desenvolvedores que desejam incorporar as mesmas funções de serviço usadas pelo `component_masking` devem consultar o arquivo `internal\components\masking\component_masking.h` em uma distribuição de código-fonte do MySQL ou https://dev.mysql.com/doc/dev/mysql-server/latest.
* Um componente chamado `component_masking_functions` que fornece funções carregáveis.

O conjunto de funções carregáveis permite uma API de nível SQL para realizar operações de máscara e desidentificação. Algumas das funções requerem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.