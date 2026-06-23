## 16.8 Limitações do Dicionário de Dados

Esta seção descreve as limitações temporárias introduzidas com o dicionário de dados MySQL.

* A criação manual de diretórios de banco de dados sob o diretório de dados (por exemplo, com **mkdir**) não é suportada. Diretórios de banco de dados criados manualmente não são reconhecidos pelo MySQL Server.

* As operações DDL levam mais tempo devido à gravação em armazenamento, registros de desfazer e registros de refazer, em vez de arquivos `.frm`.