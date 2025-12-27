#### 7.6.6.8 Diretórios e Arquivos Criados Durante uma Operação de Clonagem

Quando os dados são clonados, os seguintes diretórios e arquivos são criados para uso interno. Eles não devem ser modificados.

* `#clone`: Contém arquivos internos de clonagem usados pela operação de clonagem. Criados no diretório para onde os dados são clonados.

* `#ib_archive`: Contém arquivos de log arquivados internamente, arquivados no doador durante a operação de clonagem.

* Arquivos `*.#clone`: Arquivos de dados temporários criados no destinatário enquanto os dados são removidos do diretório de dados do destinatário e novos dados são clonados durante uma operação de clonagem remota.