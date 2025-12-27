## 19.1 Configurando a Replicação

19.1.1 Configuração de Replicação Baseada na Posição do Arquivo de Log Binário

19.1.2 Configuração de Replicação Baseada na Posição do Arquivo de Log Binário

19.1.3 Replicação com Identificadores de Transações Globais

19.1.4 Alterando o Modo GTID em Servidores Online

19.1.5 Replicação Multi-Fonte MySQL

19.1.6 Opções e Variáveis de Registro e Replicação

19.1.7 Tarefas Comuns de Administração de Replicação

Esta seção descreve como configurar os diferentes tipos de replicação disponíveis no MySQL e inclui a configuração e o setup necessários para um ambiente de replicação, incluindo instruções passo a passo para criar um novo ambiente de replicação. Os principais componentes desta seção são:

* Para um guia sobre como configurar dois ou mais servidores para replicação usando posições de arquivos de log binário, a Seção 19.1.2, “Configurando a Replicação Baseada na Posição do Arquivo de Log Binário”, trata da configuração dos servidores e fornece métodos para copiar dados entre a fonte e as réplicas.

* Para um guia sobre como configurar dois ou mais servidores para replicação usando transações GTID, a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”, trata da configuração dos servidores.

* Os eventos no log binário são registrados usando vários formatos. Estes são referidos como replicação baseada em declarações (SBR) ou replicação baseada em linhas (RBR). Um terceiro tipo, replicação de formato misto (MIXED), usa a replicação SBR ou RBR automaticamente para aproveitar os benefícios dos formatos SBR e RBR quando apropriado. Os diferentes formatos são discutidos na Seção 19.2.1, “Formatos de Replicação”.

* Informações detalhadas sobre as diferentes opções de configuração e variáveis que se aplicam à replicação são fornecidas na Seção 19.1.6, “Opções e Variáveis de Registro e Replicação”.

* Uma vez iniciado, o processo de replicação deve exigir pouca administração ou monitoramento. No entanto, para obter conselhos sobre tarefas comuns que você pode querer executar, consulte a Seção 19.1.7, “Tarefas comuns de administração de replicação”.