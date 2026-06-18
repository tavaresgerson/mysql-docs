## 10.11 Otimizando operações de bloqueio

10.11.1 Métodos de bloqueio interno

10.11.2 Problemas de bloqueio da tabela

10.11.3 Inserções Concorrentes

10.11.4 Bloqueio de metadados

10.11.5 Fechamento Externo

O MySQL gerencia a disputa pelo conteúdo da tabela usando bloqueio:

- O bloqueio interno é realizado dentro do próprio servidor MySQL para gerenciar a concorrência pelo conteúdo da tabela por vários threads. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Veja a Seção 10.11.1, “Métodos de Bloqueio Interno”.

- O bloqueio externo ocorre quando o servidor e outros programas bloqueiam os arquivos da tabela `MyISAM` para coordenar entre si qual programa pode acessar as tabelas em que momento. Veja a Seção 10.11.5, “Bloqueio Externo”.
