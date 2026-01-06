### 21.3.7 Atualização e Downgrade do NDB Cluster

21.3.7.1 Atualização e Downgrade do NDB 7.5

21.3.7.2 Atualização e Downgrade do NDB 7.6

As seções a seguir fornecem informações sobre a atualização e a desatualização do NDB Cluster 7.5 e 7.6.

As operações de esquema, incluindo instruções de DDL SQL, não podem ser realizadas enquanto quaisquer nós de dados estiverem sendo reiniciados, e, portanto, durante uma atualização ou atualização para uma versão anterior online do clúster. Para obter mais informações sobre o procedimento de reinício contínuo usado para realizar uma atualização online, consulte Seção 21.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

Importante

A compatibilidade entre as versões de lançamento é considerada apenas em relação a `NDBCLUSTER` nesta seção, e há questões adicionais a serem consideradas. Veja Seção 2.10, “Atualização do MySQL”.

*Assim como em qualquer outra atualização ou downgrade do software MySQL, é altamente recomendável que você revise as partes relevantes do Manual MySQL para as versões do MySQL das quais e para as quais você pretende migrar, antes de tentar uma atualização ou downgrade do software NDB Cluster*.
