### 6.5.8 mysqldm — O Monitor de Diagnóstico do MySQL

6.5.8.1 Opções

6.5.8.2 Consultas de Diagnóstico

O monitor de diagnóstico **mysqldm** permite que você colete dados de diagnóstico no seu servidor MySQL. Ele executa uma série de consultas e gera arquivos JSON contendo os resultados dessas consultas.

Dois conjuntos de consultas são executados. O primeiro conjunto de consultas é executado apenas uma vez. O segundo conjunto de consultas é executado iterativamente. As consultas iterativas são executadas dez vezes, por padrão. O número de iterações é configurável, assim como o atraso entre as iterações.

Importante

**mysqldm** é fornecido apenas com a Edição Empresarial do MySQL.

Inicie **mysqldm** da seguinte forma:

```
mysqldm [options] [mysqldm-options]
```

Por exemplo:

```
$> mysqldm -u root -h localhost -p --iterations=5 --delay=20 --output-dir=mysqldm
```

Este exemplo se conecta a um servidor local, executa cinco iterações de consultas de diagnóstico, com um atraso de 20 segundos entre as iterações, e exibe os resultados no diretório `mysqldm` na mesma localização onde o comando foi executado.

O relatório de diagnóstico é gerado como um arquivo zip para o diretório local ou um caminho especificado.