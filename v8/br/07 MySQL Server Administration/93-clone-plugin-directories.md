#### 7.6.7.8 Diretórios e Arquivos Criados Durante uma Operação de Clonagem

Quando os dados são clonados, os seguintes diretórios e arquivos são criados para uso interno. Eles não devem ser modificados.

* `#clone`: Contém arquivos internos de clonagem usados pela operação de clonagem. Criados no diretório para onde os dados estão sendo clonados.
* `#ib_archive`: Contém arquivos de log arquivados internamente, arquivados no doador durante a operação de clonagem.
* Arquivos `*.#clone`: Arquivos de dados temporários criados no destinatário enquanto os dados estão sendo removidos do diretório de dados do destinatário e novos dados estão sendo clonados durante uma operação de clonagem remota.