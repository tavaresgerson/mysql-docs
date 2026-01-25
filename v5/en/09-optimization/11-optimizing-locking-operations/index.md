## 8.11 Otimizando Operações de Locking

8.11.1 Métodos Internos de Locking

8.11.2 Problemas de Table Locking

8.11.3 Inserts Concorrentes

8.11.4 Metadata Locking

8.11.5 External Locking

O MySQL gerencia a contenção pelo conteúdo das tabelas usando locking:

* O Internal locking é executado dentro do próprio MySQL server para gerenciar a contenção pelo conteúdo da tabela por múltiplos threads. Este tipo de locking é interno porque é realizado inteiramente pelo server e não envolve outros programas. Consulte a Seção 8.11.1, “Métodos Internos de Locking”.

* O External locking ocorre quando o server e outros programas bloqueiam arquivos de tabela `MyISAM` para coordenar entre si qual programa pode acessar as tabelas em determinado momento. Consulte a Seção 8.11.5, “External Locking”.