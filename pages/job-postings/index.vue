<template>
  <app-main>
    <app-container>
      <JobsPostingsHeading />
      <div class="flex justify-end mb-8">
        <JobsPostingsCreateEdit>
          <Button size="lg">
            {{ $t("jobs.add_job") }}
          </Button>
        </JobsPostingsCreateEdit>
      </div>

      <JobsPostingsList />
    </app-container>
  </app-main>
</template>
