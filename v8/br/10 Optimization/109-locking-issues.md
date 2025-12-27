## 10.11 Otimizando Operações de Bloqueio

O MySQL gerencia a concorrência por conteúdo de tabelas usando bloqueios:

* O bloqueio interno é realizado dentro do próprio servidor MySQL para gerenciar a concorrência por conteúdo de tabelas por vários threads. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Consulte a Seção 10.11.1, “Métodos de Bloqueio Interno”.
* O bloqueio externo ocorre quando o servidor e outros programas bloqueiam os arquivos de tabelas `MyISAM` para coordenar entre si qual programa pode acessar as tabelas em que momento. Consulte a Seção 10.11.5, “Bloqueio Externo”.