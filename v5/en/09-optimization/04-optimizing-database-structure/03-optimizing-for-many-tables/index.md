### 8.4.3 Otimizando para Muitas Tabelas

8.4.3.1 Como o MySQL Abre e Fecha Tabelas

8.4.3.2 Desvantagens de Criar Muitas Tabelas no Mesmo Database

Algumas técnicas para manter **Queries** individuais rápidas envolvem dividir dados entre muitas tabelas. Quando o número de tabelas atinge milhares ou até milhões, o **overhead** de lidar com todas essas tabelas se torna uma nova consideração de **performance**.