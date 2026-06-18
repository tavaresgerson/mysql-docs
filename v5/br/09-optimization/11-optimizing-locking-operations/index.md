## 8.11 Otimização das operações de bloqueio

O MySQL gerencia a disputa pelo conteúdo da tabela usando bloqueio:

- O bloqueio interno é realizado dentro do próprio servidor MySQL para gerenciar a concorrência pelo conteúdo da tabela por vários threads. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Veja a Seção 8.11.1, “Métodos de Bloqueio Interno”.

- O bloqueio externo ocorre quando o servidor e outros programas bloqueiam os arquivos de tabela `MyISAM` para coordenar entre si qual programa pode acessar as tabelas em que momento. Veja a Seção 8.11.5, “Bloqueio Externo”.
