## 7.5 Recuperação pontual (incremental)

7.5.1 Recuperação no Ponto de Tempo Usando Log de Binário

7.5.2 Recuperação no Ponto de Tempo Usando Posições de Eventos

A recuperação em um ponto no tempo refere-se à recuperação de alterações de dados até um determinado ponto no tempo. Tipicamente, esse tipo de recuperação é realizado após a restauração de um backup completo que traz o servidor ao seu estado no momento em que o backup foi feito. (O backup completo pode ser feito de várias maneiras, como as listadas na Seção 7.2, “Métodos de Backup de Banco de Dados”.) A recuperação em um ponto no tempo, então, atualiza o servidor incrementalmente a partir do momento do backup completo até um momento mais recente.
