## 19.1 Configurando a Replicação

19.1.1 Configuração de Replicação Baseada na Posição do Arquivo de Registro Binário

19.1.2 Configuração da replicação com base na posição do arquivo de registro binário

19.1.3 Replicação com Identificadores de Transação Global

19.1.4 Alterar o modo GTID em servidores online

19.1.5 Replicação de múltiplas fontes do MySQL

19.1.6 Opções e variáveis de replicação e registro binário

19.1.7 Tarefas comuns de administração de replicação

Esta seção descreve como configurar os diferentes tipos de replicação disponíveis no MySQL e inclui a configuração e configuração necessárias para um ambiente de replicação, incluindo instruções passo a passo para criar um novo ambiente de replicação. Os principais componentes desta seção são:

- Para obter orientações sobre a configuração de dois ou mais servidores para replicação usando posições de arquivos de log binário, a Seção 19.1.2, “Configuração da replicação com base em posições de arquivo de log binário”, trata da configuração dos servidores e fornece métodos para copiar dados entre a fonte e as réplicas.

- Para obter orientações sobre a configuração de dois ou mais servidores para replicação usando transações GTID, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”, que trata da configuração dos servidores.

- Os eventos no log binário são registrados usando vários formatos. Esses são chamados de replicação baseada em declarações (SBR) ou replicação baseada em linhas (RBR). Um terceiro tipo, a replicação de formatos mistos (MIXED), usa a replicação SBR ou RBR automaticamente para aproveitar os benefícios dos formatos SBR e RBR quando apropriado. Os diferentes formatos são discutidos na Seção 19.2.1, “Formatos de replicação”.

- Informações detalhadas sobre as diferentes opções de configuração e variáveis que se aplicam à replicação estão fornecidas na Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

- Uma vez iniciado, o processo de replicação deve exigir pouca administração ou monitoramento. No entanto, para obter conselhos sobre tarefas comuns que você pode querer executar, consulte a Seção 19.1.7, “Tarefas comuns de administração de replicação”.
