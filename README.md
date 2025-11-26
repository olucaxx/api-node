# Começando com o Heroku

O **Heroku** é uma plataforma de hospedagem em nuvem que permite realizar deploy de aplicações de forma simples, seguindo um fluxo parecido com o Git. Cada aplicação possui seu próprio ambiente isolado, e o código é publicado através de push para o repositório remoto do Heroku.

## Apps e Dynos

* Um **app** no Heroku representa um serviço completo (como um site ou API).
* Cada app roda dentro de **dynos**, que são máquinas Linux isoladas semelhantes a containers Docker.
* Você pode possuir **vários tipos de dynos**, dependendo do preço, propósito e requisitos do projeto.

### Tipos de Dynos

Os planos mais comuns são:

* **Eco**:

  * Dyno simples e barato (US$ 5/mês por 1000 horas, compartilhado em todos os dynos eco).
  * Entra em hibernação após 30 minutos sem receber requisições.
  * Ideal para situações simples e com pouco tráfego.
  * Suporta até 2 tipos de processos rodando. Ex.: 1 web e 1 schedule

* **Basic**:

  * Mantém um dyno ativo 24/7 (US$7/mês por UM dyno);
  * Melhor para casos que precisam estar sempre online.
  * Suporta até 10 tipos de processos rodando. Ex.: 1 web, 1 worker, 1 schedule...

* **Standard** e **Performance**:

  * Tiers mais avançados, com maior desempenho, RAM, escalabilidade e múltiplos processos.

# O que precisa mudar para rodar o meu app Node?

## Procfile

Criar um "**Procfile**", ele é um arquivo de mesmo nome (sem . nem nada) que define quais processos o Heroku deve iniciar e qual comando cada processo executa. Exemplo de Procfile para um projeto Node.js:

```
web: node server.js
```

Isso indica ao Heroku que existe um dyno do tipo **web**, que deve rodar o comando `node server.js`.

Você não pode repetir os tipos, mas pode ter mais de um, é aqui que você indica se será do tipo **web**, **worker**, **schedule**, etc.


## package.json

Para Node.js, é necessário definir um script de inicialização:

```json
"scripts": {
  "start": "node server.js"
}
```

Isso garante que o Heroku saiba como iniciar sua aplicação. Você também deve colocar todas as dependências e requisitos corretamente, o Heroku vai depender diretamente do conteudo do seu package.json para instalar o que for necessário para rodar a aplicação.

# Como fazer o primeiro deploy no Heroku

### 1. Criar o app (caso ainda não exista)

```
heroku create
```

### 2. Vincular seu repositório local ao app do Heroku

```
git remote add heroku https://git.heroku.com/nome-do-app.git
```

ou

```
heroku git:remote -a nome-do-app
```


### 3. Definir variáveis de ambiente

```
heroku config:set CHAVE=valor
```

Exemplo:

```
heroku config:set PORT=3000
heroku config:set API_KEY=segredo_de_estado
```

### 4. Publicar o código (fazer o deploy)

```
git push heroku main
```

Após o deploy ser concluído com sucesso, o Heroku gera automaticamente um link público para o app, que fica imediatamente acessível.

Temos vários outros comandos e configurações que podem ser feitas, como por exemplo:


```
heroku git:clone -a nome-do-app // Clonar o código hospedado no Heroku
heroku logs --tail              // Ver logs da aplicação
heroku info                     // Ver informações gerais do app
heroku config                   // Listar variáveis de ambiente
heroku config:unset NOME        // Remover uma variável
heroku restart                  // Reiniciar o dyno (útil ao mudar as variáveis)
heroku ps                       // Ver processos ativos
heroku open                     // Abrir o app no navegador
heroku run bash                 // Acessar o terminal do dyno
heroku run node script.js       // Rodar um script
heroku run node                 // Abrir REPL
```
