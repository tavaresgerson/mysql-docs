#### 7.6.7.8 Directórios e ficheiros criados durante uma operação de clonagem

Quando os dados são clonados, os seguintes diretórios e arquivos são criados para uso interno.

- `#clone`: Contém arquivos de clonagem internos usados pela operação de clonagem. Criado no diretório no qual os dados são clonados.
- `#ib_archive`: Contém arquivos de registro arquivados internamente, arquivados no doador durante a operação de clonagem.
- `*.#clone` arquivos: arquivos de dados temporários criados no destinatário enquanto os dados são removidos do diretório de dados do destinatário e novos dados são clonados durante uma operação de clonagem remota.
