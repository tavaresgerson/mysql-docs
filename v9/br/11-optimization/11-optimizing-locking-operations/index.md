## 10.11 Otimização das Operações de Bloqueio

10.11.1 Métodos de Bloqueio Interno

10.11.2 Problemas de Bloqueio de Tabelas

10.11.3 Inserções Concorrentes

10.11.4 Bloqueio de Metadados

10.11.5 Bloqueio Externo

O MySQL gerencia a concorrência por conteúdo de tabelas usando o bloqueio:

* O bloqueio interno é realizado dentro do próprio servidor MySQL para gerenciar a concorrência por conteúdo de tabelas por vários threads. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Consulte a Seção 10.11.1, “Métodos de Bloqueio Interno”.

* O bloqueio externo ocorre quando o servidor e outros programas bloqueiam os arquivos de tabelas `MyISAM` para coordenar entre si qual programa pode acessar as tabelas em que momento. Consulte a Seção 10.11.5, “Bloqueio Externo”.