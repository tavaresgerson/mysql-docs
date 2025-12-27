### 14.16.9 Funções que testam relações espaciais entre objetos geométricos

14.16.9.1 Funções de relação espacial que utilizam formas de objetos

14.16.9.2 Funções de relação espacial que utilizam retângulos de delimitação mínimos

As funções descritas nesta seção recebem duas geometrias como argumentos e retornam uma relação qualitativa ou quantitativa entre elas.

O MySQL implementa dois conjuntos de funções utilizando nomes de funções definidos pela especificação OpenGIS. Um conjunto testa a relação entre dois valores de geometria usando formas de objetos precisas, e o outro conjunto utiliza retângulos de delimitação mínimos (MBRs) de objetos.