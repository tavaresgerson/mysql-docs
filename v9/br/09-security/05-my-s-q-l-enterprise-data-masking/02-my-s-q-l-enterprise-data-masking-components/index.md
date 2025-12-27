### 8.5.2 Componentes de Máscara de Dados do MySQL Enterprise

8.5.2.1 Instalação dos Componentes de Máscara de Dados do MySQL Enterprise

8.5.2.2 Uso dos Componentes de Máscara de Dados do MySQL Enterprise

8.5.2.3 Referência de Funções dos Componentes de Máscara de Dados do MySQL Enterprise

8.5.2.4 Descrições das Funções dos Componentes de Máscara de Dados do MySQL Enterprise

8.5.2.5 Variáveis dos Componentes de Máscara de Dados do MySQL Enterprise

A Máscara de Dados do MySQL Enterprise implementa os seguintes elementos:

* Uma tabela para armazenamento persistente de dicionários e termos.
* Um componente chamado `component_masking` que implementa a funcionalidade de máscara e a expõe como interface de serviço para os desenvolvedores.

Os desenvolvedores que desejam incorporar as mesmas funções de serviço usadas pelo `component_masking` devem consultar o arquivo `internal\components\masking\component_masking.h` em uma distribuição de código-fonte do MySQL ou https://dev.mysql.com/doc/dev/mysql-server/latest.

* Um componente chamado `component_masking_functions` que fornece funções carregáveis.

O conjunto de funções carregáveis permite uma API de nível SQL para realizar operações de máscara e desidentificação. Algumas das funções requerem o privilégio dinâmico `MASKING_DICTIONARIES_ADMIN`.