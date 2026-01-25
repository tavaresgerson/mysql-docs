## 7.5 Recuperação para um Ponto no Tempo (Incremental)

7.5.1 Point-in-Time Recovery Usando o Binary Log

7.5.2 Point-in-Time Recovery Usando Posições de Evento

Point-in-Time Recovery refere-se à recuperação de alterações de dados até um determinado ponto no tempo. Tipicamente, este tipo de recovery é realizado após a restauração de um full backup que leva o servidor ao seu estado no momento em que o backup foi feito. (O full backup pode ser feito de várias maneiras, como as listadas na Seção 7.2, “Database Backup Methods”.) O Point-in-Time Recovery, em seguida, atualiza o servidor incrementalmente, desde o momento do full backup até um momento mais recente.