#### 8.4.3.2 Desvantagens de criar muitas tabelas na mesma base de dados

Se você tiver muitas tabelas `MyISAM` no mesmo diretório do banco de dados, as operações de abrir, fechar e criar são lentas. Se você executar instruções `SELECT` em muitas tabelas diferentes, há um pequeno overhead quando o cache da tabela está cheio, porque, para cada tabela que precisa ser aberta, outra deve ser fechada. Você pode reduzir esse overhead aumentando o número de entradas permitidas no cache da tabela.
